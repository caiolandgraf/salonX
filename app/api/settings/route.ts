import { type NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

// Inicializar tabela de configurações se não existir
function initSettingsTable() {
	db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      category TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

	// Inserir configurações padrão se não existirem
	const count = db.prepare("SELECT COUNT(*) as count FROM settings").get() as {
		count: number;
	};

	if (count.count === 0) {
		const defaultSettings = [
			// Configurações gerais
			{ key: "business_name", value: "SalonX", category: "general" },
			{ key: "business_email", value: "contato@bunx.io", category: "general" },
			{ key: "business_phone", value: "(11) 99999-9999", category: "general" },
			{ key: "business_address", value: "", category: "general" },
			{ key: "business_city", value: "", category: "general" },
			{ key: "business_state", value: "", category: "general" },
			{ key: "business_zipcode", value: "", category: "general" },

			// Configurações de agendamento
			{ key: "booking_interval", value: "30", category: "booking" },
			{ key: "booking_start_hour", value: "08:00", category: "booking" },
			{ key: "booking_end_hour", value: "20:00", category: "booking" },
			{ key: "booking_max_advance_days", value: "90", category: "booking" },
			{ key: "booking_allow_overlap", value: "false", category: "booking" },
			{
				key: "booking_require_confirmation",
				value: "true",
				category: "booking",
			},

			// Configurações financeiras
			{ key: "default_commission", value: "30", category: "financial" },
			{ key: "accept_credit_card", value: "true", category: "financial" },
			{ key: "accept_debit_card", value: "true", category: "financial" },
			{ key: "accept_pix", value: "true", category: "financial" },
			{ key: "accept_cash", value: "true", category: "financial" },

			// Notificações
			{
				key: "notify_new_appointment",
				value: "true",
				category: "notifications",
			},
			{
				key: "notify_appointment_reminder",
				value: "true",
				category: "notifications",
			},
			{ key: "notify_low_stock", value: "true", category: "notifications" },
			{
				key: "notification_reminder_hours",
				value: "24",
				category: "notifications",
			},

			// Estoque
			{ key: "stock_alert_threshold", value: "10", category: "stock" },
			{ key: "stock_auto_deduct", value: "false", category: "stock" },
		];

		const stmt = db.prepare(
			"INSERT INTO settings (key, value, category) VALUES (?, ?, ?)",
		);
		for (const setting of defaultSettings) {
			stmt.run(setting.key, setting.value, setting.category);
		}
	}
}

// Inicializar ao carregar
initSettingsTable();

// GET - Obter configurações
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const category = searchParams.get("category");
		const key = searchParams.get("key");

		let query = "SELECT * FROM settings WHERE 1=1";
		const params: any[] = [];

		if (category) {
			query += " AND category = ?";
			params.push(category);
		}

		if (key) {
			query += " AND key = ?";
			params.push(key);
		}

		const settings = db.prepare(query).all(...params);

		// Se buscar por key específica, retornar só o valor
		if (key && settings.length === 1) {
			return NextResponse.json(settings[0]);
		}

		// Organizar por categoria
		const organized: Record<string, any> = {};
		for (const setting of settings) {
			const s = setting as any;
			if (!organized[s.category]) {
				organized[s.category] = {};
			}
			organized[s.category][s.key] = s.value;
		}

		return NextResponse.json(organized);
	} catch (error) {
		console.error("Error fetching settings:", error);
		return NextResponse.json(
			{ error: "Erro ao buscar configurações" },
			{ status: 500 },
		);
	}
}

// PUT - Atualizar configurações
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { settings } = body;

		if (!settings || typeof settings !== "object") {
			return NextResponse.json(
				{ error: "Formato inválido. Envie { settings: { key: value, ... } }" },
				{ status: 400 },
			);
		}

		const stmt = db.prepare(`
      UPDATE settings
      SET value = ?, updated_at = datetime('now')
      WHERE key = ?
    `);

		const updated: string[] = [];
		for (const [key, value] of Object.entries(settings)) {
			const result = stmt.run(String(value), key);
			if (result.changes > 0) {
				updated.push(key);
			}
		}

		return NextResponse.json({
			success: true,
			updated,
			message: `${updated.length} configurações atualizadas`,
		});
	} catch (error) {
		console.error("Error updating settings:", error);
		return NextResponse.json(
			{ error: "Erro ao atualizar configurações" },
			{ status: 500 },
		);
	}
}

// POST - Criar nova configuração
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { key, value, category } = body;

		if (!key || !value || !category) {
			return NextResponse.json(
				{ error: "Campos obrigatórios: key, value, category" },
				{ status: 400 },
			);
		}

		// Verificar se já existe
		const existing = db
			.prepare("SELECT key FROM settings WHERE key = ?")
			.get(key);
		if (existing) {
			return NextResponse.json(
				{ error: "Configuração já existe. Use PUT para atualizar." },
				{ status: 409 },
			);
		}

		db.prepare(`
      INSERT INTO settings (key, value, category)
      VALUES (?, ?, ?)
    `).run(key, value, category);

		const newSetting = db
			.prepare("SELECT * FROM settings WHERE key = ?")
			.get(key);

		return NextResponse.json(newSetting, { status: 201 });
	} catch (error) {
		console.error("Error creating setting:", error);
		return NextResponse.json(
			{ error: "Erro ao criar configuração" },
			{ status: 500 },
		);
	}
}
