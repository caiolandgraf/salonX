# 📚 Guia de Uso do CRM - Exemplos Práticos

## 🎬 Casos de Uso Comuns

### 1. Cadastrar um Novo Cliente

**Cenário**: Uma nova cliente ligou para agendar um serviço.

**Passos**:
1. Acesse **Dashboard → Clientes**
2. Clique em **"Novo Cliente"**
3. Preencha os dados:
   ```
   Nome: Maria Silva
   Email: maria.silva@email.com
   Telefone: (11) 98765-4321
   Data de Nascimento: 15/03/1990
   Endereço: Rua das Flores, 123
   Cidade: São Paulo
   Estado: SP
   CEP: 01234-567
   Como conheceu: Instagram
   Segmento: Novo
   Observações: Interessada em coloração e corte
   ```
4. Clique em **"Cadastrar"**

**Resultado**: Cliente cadastrado com segmento "Novo" automaticamente.

---

### 2. Registrar uma Interação com Cliente

**Cenário**: Você ligou para confirmar um agendamento.

**Passos**:
1. Na lista de clientes, clique no ícone 👁️ (olho) ao lado do nome do cliente
2. Vá para a aba **"Notas & Follow-ups"**
3. Clique em **"Nova Nota"**
4. Selecione:
   ```
   Tipo: Ligação
   Conteúdo: Confirmação do agendamento para sexta-feira às 14h.
   Cliente confirmou presença e perguntou sobre preços de alisamento.
   ```
5. Clique em **"Salvar"**

**Resultado**: Nota registrada com data, hora e usuário que criou.

---

### 3. Acompanhar o Histórico de um Cliente

**Cenário**: Cliente retorna após 3 meses e você quer revisar o histórico.

**Passos**:
1. Busque o cliente na barra de pesquisa
2. Clique no ícone 👁️ (olho)
3. Verifique na aba **"Visão Geral"**:
   - Total gasto: R$ 850,00
   - Número de visitas: 6
   - Ticket médio: R$ 141,67
   - Última visita: há 3 meses
4. Vá para a aba **"Histórico"** para ver:
   - Todos os serviços realizados
   - Valores pagos
   - Datas das visitas
5. Vá para a aba **"Notas"** para ver:
   - Conversas anteriores
   - Preferências registradas
   - Follow-ups pendentes

---

### 4. Segmentar Clientes para Campanha de Marketing

**Cenário**: Criar uma campanha para clientes VIP.

**Passos**:
1. No filtro de segmentos, selecione **"VIP"**
2. Revise a lista de clientes VIP
3. Use o botão de exportação (📥) para baixar a lista
4. Use os dados para:
   - Enviar convites para eventos exclusivos
   - Oferecer descontos especiais
   - Priorizar agendamentos

**Resultado**: Lista filtrada apenas com clientes que gastaram R$ 1.000+

---

### 5. Atualizar Segmento Manualmente

**Cenário**: Cliente especial que deve ser tratado como VIP mesmo sem atingir o valor mínimo.

**Passos**:
1. Abra os detalhes do cliente
2. Clique no ícone ✏️ ao lado do badge de segmento
3. Selecione **"VIP"** no menu dropdown
4. Clique em **"Salvar"**

**Resultado**: Cliente passa a aparecer nos filtros de VIP.

---

### 6. Programar Follow-up

**Cenário**: Cliente demonstrou interesse em um serviço mas não agendou.

**Passos**:
1. Abra os detalhes do cliente
2. Clique em **"Editar"** (ícone de lápis na lista)
3. No formulário, localize o campo **"Próximo Follow-up"**
4. Adicione uma data (ex: daqui a 7 dias)
5. Vá para a aba **"Notas"** e adicione:
   ```
   Tipo: Follow-up
   Conteúdo: Retornar contato sobre interesse em alisamento.
   Cliente pediu para ligar semana que vem.
   ```
6. Salve as alterações

**Resultado**: Sistema marca o cliente para follow-up na data especificada.

---

### 7. Identificar Clientes Inativos

**Cenário**: Reativar clientes que não visitam há muito tempo.

**Passos**:
1. No filtro de segmentos, selecione **"Inativo"**
2. Revise a lista
3. Para cada cliente:
   - Verifique a última visita
   - Adicione nota sobre tentativa de contato
   - Registre resposta (ou falta dela)

**Resultado**: Lista de clientes que precisam de reengajamento.

---

### 8. Análise de Valor do Cliente (LTV)

**Cenário**: Identificar os clientes mais valiosos do salão.

**Passos**:
1. Na lista de clientes, observe a coluna **"Total Gasto"**
2. Ordene por valor (do maior para o menor)
3. Os clientes no topo são os de maior LTV
4. Para cada um:
   - Verifique frequência de visitas
   - Analise ticket médio
   - Identifique padrões (serviços preferidos, horários)

**Resultado**: Insights sobre seus melhores clientes.

---

## 🎯 Boas Práticas

### 1. Registre Todas as Interações
- Sempre adicione uma nota após ligações importantes
- Registre preferências do cliente
- Anote datas especiais (aniversário, casamento, etc.)

### 2. Mantenha Dados Atualizados
- Confirme telefone e email em cada visita
- Atualize endereço se o cliente mencionar mudança
- Peça para completar dados faltantes

### 3. Use o Sistema de Follow-ups
- Programe lembretes para contatos futuros
- Acompanhe clientes que não retornam
- Comemore aniversários e datas especiais

### 4. Segmente de Forma Estratégica
- **Novos**: Foque em primeira impressão
- **Regulares**: Mantenha qualidade e relacionamento
- **VIP**: Tratamento premium e exclusividade
- **Inativos**: Campanhas de reativação

### 5. Analise Métricas Regularmente
- Acompanhe crescimento da base de clientes
- Monitore ticket médio
- Identifique tendências de gastos

---

## 🚀 Fluxos de Trabalho Sugeridos

### Fluxo 1: Nova Cliente
```
1. Cadastro no CRM → Segmento: NOVO
2. Primeiro atendimento
3. Nota: Experiência do primeiro serviço
4. Follow-up: 3 dias depois (pedir feedback)
5. Se retornar: Atualizar para REGULAR
```

### Fluxo 2: Cliente Regular
```
1. A cada visita: Atualizar última visita
2. Registrar serviços realizados
3. Após 5 visitas: Sistema promove para REGULAR
4. Follow-up mensal para manter engajamento
5. Se LTV > R$ 1.000: Sistema promove para VIP
```

### Fluxo 3: Cliente VIP
```
1. Tratamento preferencial
2. Agendamentos prioritários
3. Ofertas exclusivas
4. Contato pessoal em datas especiais
5. Programa de indicação (referral)
```

### Fluxo 4: Cliente Inativo
```
1. Identificar: Sem visita há 90+ dias
2. Primeira tentativa: WhatsApp com promoção
3. Nota: Registrar resposta
4. Segunda tentativa: Ligação pessoal
5. Se não retornar: Marcar como INATIVO
```

---

## 📊 Exemplos de Relatórios

### Relatório Mensal de Clientes
```
Total de Clientes: 150
- Novos: 15 (10%)
- Regulares: 85 (57%)
- VIP: 30 (20%)
- Inativos: 20 (13%)

Receita Total: R$ 45.000
Ticket Médio: R$ 300
LTV Médio: R$ 1.200
```

### Top 10 Clientes por Valor
```
1. Ana Paula Silva    - R$ 3.500 (12 visitas)
2. Carla Santos       - R$ 2.800 (9 visitas)
3. Beatriz Lima       - R$ 2.600 (8 visitas)
...
```

---

## 🔔 Alertas e Lembretes

### Configure Alertas Para:
- [ ] Aniversários de clientes (7 dias antes)
- [ ] Follow-ups programados
- [ ] Clientes sem visita há 60 dias
- [ ] Clientes VIP há 30 dias sem contato
- [ ] Novos clientes que não retornaram (15 dias)

---

## 💡 Dicas Avançadas

### 1. Use Tags para Organização
```
Exemplos de tags:
- "Coloração preferida"
- "Alergias conhecidas"
- "Horário preferencial: manhã"
- "Profissional favorito"
- "Indicou amigos"
```

### 2. Personalize a Comunicação
```
Baseado no histórico:
- Cliente que gosta de novidades → Envie promoções de novos serviços
- Cliente pontual → Confirmações simples
- Cliente com histórico de atraso → Confirmações mais próximas
```

### 3. Crie Jornadas do Cliente
```
Mapeie a jornada típica:
Descoberta → Primeiro contato → Primeiro serviço → 
Fidelização → Indicações → Cliente embaixador
```

---

**🎉 Pronto! Agora você tem um CRM profissional funcionando no seu salão!**
