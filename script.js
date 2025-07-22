// Função para converter hora no formato HH:MM para minutos totais
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Função para converter minutos totais para formato HH:MM
function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Calcula horas trabalhadas descontando almoço
function calcularHoras(data) {
  const entrada = timeToMinutes(data.entrada);
  const saidaAlmoco = timeToMinutes(data.saidaAlmoco);
  const retornoAlmoco = timeToMinutes(data.retornoAlmoco);
  const saida = timeToMinutes(data.saida);

  const totalTrabalhado = (saida - entrada) - (retornoAlmoco - saidaAlmoco);
  return totalTrabalhado;
}

// Salva o histórico no localStorage
function salvarHistorico(item) {
  const historico = JSON.parse(localStorage.getItem('historicoHoras')) || [];
  historico.push(item);
  localStorage.setItem('historicoHoras', JSON.stringify(historico));
}

// Carrega o histórico do localStorage
function carregarHistorico() {
  const historico = JSON.parse(localStorage.getItem('historicoHoras')) || [];
  return historico;
}

// Atualiza a exibição do histórico na tela
function atualizarHistorico() {
  const historico = carregarHistorico();
  const historicoDiv = document.getElementById('historico');
  if (historico.length === 0) {
    historicoDiv.textContent = 'Nenhum registro salvo.';
    return;
  }
  historicoDiv.innerHTML = '';
  historico.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${item.data}: ${item.horas} horas trabalhadas`;
    historicoDiv.appendChild(div);
  });
}

// Limpa o histórico e localStorage
function limparHistorico() {
  localStorage.removeItem('historicoHoras');
  atualizarHistorico();
}

// Inicialização e eventos
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formHoras');
  const resultado = document.getElementById('resultado');
  const btnLimpar = document.getElementById('btnLimpar');

  atualizarHistorico();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      data: form.data.value,
      entrada: form.entrada.value,
      saidaAlmoco: form.saidaAlmoco.value,
      retornoAlmoco: form.retornoAlmoco.value,
      saida: form.saida.value,
      jornada: Number(form.jornada.value)
    };

    if (!data.data || !data.entrada || !data.saidaAlmoco || !data.retornoAlmoco || !data.saida) {
      resultado.textContent = 'Por favor, preencha todos os campos de horário!';
      return;
    }

    const minutosTrabalhados = calcularHoras(data);
    const horasTrabalhadas = minutosTrabalhados / 60;
    const saldo = horasTrabalhadas - data.jornada;

    resultado.textContent = `Horas trabalhadas: ${horasTrabalhadas.toFixed(2)} h | Saldo: ${saldo.toFixed(2)} h`;

    salvarHistorico({ data: data.data, horas: horasTrabalhadas.toFixed(2) });
    atualizarHistorico();
    form.reset();
  });

  btnLimpar.addEventListener('click', () => {
    if (confirm('Deseja limpar todo o histórico?')) {
      limparHistorico();
      resultado.textContent = 'Preencha os dados e clique em Calcular';
    }
  });
});
