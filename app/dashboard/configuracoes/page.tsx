import { Settings } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground text-lg mt-1">
          Configurações gerais do sistema
        </p>
      </div>

      <Card className="flex flex-col items-center justify-center py-16">
        <Settings className="h-16 w-16 text-muted-foreground mb-4" />
        <CardTitle className="text-2xl mb-2">Módulo de Configurações</CardTitle>
        <CardDescription className="text-base text-center max-w-md">
          Este módulo está em desenvolvimento. Em breve você poderá configurar
          todos os aspectos do sistema.
        </CardDescription>
      </Card>
    </div>
  );
}
