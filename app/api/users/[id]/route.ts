import { hash } from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

// GET - Buscar usuário por ID
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const user = db
			.prepare(`
      SELECT id, name, email, role, phone, active, created_at
      FROM users WHERE id = ?
    `)
			.get(id);

		if (!user) {
			return NextResponse.json(
				{ error: "Usuário não encontrado" },
				{ status: 404 },
			);
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json(
			{ error: "Erro ao buscar usuário" },
			{ status: 500 },
		);
	}
}

// PUT - Atualizar usuário
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const body = await request.json();
		const { name, email, password, role, phone, active } = body;

		// Check if user exists
		const existingUser = db
			.prepare("SELECT id FROM users WHERE id = ?")
			.get(id);
		if (!existingUser) {
			return NextResponse.json(
				{ error: "Usuário não encontrado" },
				{ status: 404 },
			);
		}

		// Build update query
		const updates: string[] = [];
		const values: any[] = [];

		if (name !== undefined) {
			updates.push("name = ?");
			values.push(name);
		}
		if (email !== undefined) {
			updates.push("email = ?");
			values.push(email);
		}
		if (password) {
			const hashedPassword = await hash(password, 10);
			updates.push("password = ?");
			values.push(hashedPassword);
		}
		if (role !== undefined) {
			updates.push("role = ?");
			values.push(role);
		}
		if (phone !== undefined) {
			updates.push("phone = ?");
			values.push(phone);
		}
		if (active !== undefined) {
			updates.push("active = ?");
			values.push(active ? 1 : 0);
		}

		if (updates.length > 0) {
			values.push(id);
			db.prepare(`
        UPDATE users SET ${updates.join(", ")} WHERE id = ?
      `).run(...values);
		}

		// Return updated user
		const user = db
			.prepare(`
      SELECT id, name, email, role, phone, active, created_at
      FROM users WHERE id = ?
    `)
			.get(id);

		return NextResponse.json(user);
	} catch (error: any) {
		console.error("Error updating user:", error);
		if (error.message.includes("UNIQUE")) {
			return NextResponse.json(
				{ error: "Email já cadastrado" },
				{ status: 409 },
			);
		}
		return NextResponse.json(
			{ error: "Erro ao atualizar usuário" },
			{ status: 500 },
		);
	}
}

// DELETE - Excluir usuário
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		// Check if user exists
		const user = db.prepare("SELECT email FROM users WHERE id = ?").get(id) as
			| { email: string }
			| undefined;

		if (!user) {
			return NextResponse.json(
				{ error: "Usuário não encontrado" },
				{ status: 404 },
			);
		}

		// Não permitir excluir admin principal
		if (user.email === "admin@bunx.io") {
			return NextResponse.json(
				{ error: "Não é possível excluir o administrador principal" },
				{ status: 403 },
			);
		}

		db.prepare("DELETE FROM users WHERE id = ?").run(id);

		return NextResponse.json({
			success: true,
			message: "Usuário excluído com sucesso",
		});
	} catch (error) {
		console.error("Error deleting user:", error);
		return NextResponse.json(
			{ error: "Erro ao excluir usuário" },
			{ status: 500 },
		);
	}
}
