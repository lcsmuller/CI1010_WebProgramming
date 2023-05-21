$(document).ready(function () {
  // Carregar dados do XML
  $.ajax({
    url: "alunos.xml",
    dataType: "xml",
    success: function (data) {
      // Construir a grade curricular
      buildCurriculumGrid(data);
      console.log("Success!");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Erro ao carregar dados do XML.");
      console.error(`${jqXHR}\n${textStatus}\n${errorThrown}`);
    },
  });
});

function getStatus(status) {
  switch (status) {
    case 1: // aprovado
    case 4: // dispensa de disciplina (com nota)
      return "approved";
    case 2: // reprovado nota
    case 3: // reprovado freq
    case 5: // cancelado
    case 9: // reprovado sem nota
    case 12: // trancamento total
    case 15: // trancamento administrativo
      return "failed";
    case 10: // matricula
      return "enrolled";
    case 11: // equivalencia disciplina
      return "equivalence";
    default:
      return "not-coursed";
  }
}

function buildCurriculumGrid(xmlData) {
  // Relaciona estudantes x disciplinas
  const disciplines = {};
  const students = {};
  $(xmlData)
    .find("ALUNO")
    .each(function () {
      const code = $(this).find("COD_ATIV_CURRIC").text();
      const RA = $(this).find("MATR_ALUNO").text();

      if (!disciplines[code]) {
        const name = $(this).find("NOME_ATIV_CURRIC").text();
        disciplines[code] = { name };
      }

      const status = parseInt($(this).find("SITUACAO_ITEM").text());

      if (!students[RA]) students[RA] = { enrolled: {} };
      students[RA].enrolled[code] = getStatus(status);
    });

  // Construir cabeçalho da tabela
  const curriculumGrid = $("#curriculum-grid");
  const headerRow = $("<tr>").append("<td></td>"); // Espaço vazio no canto superior esquerdo
  for (const [code, { name }] of Object.entries(disciplines)) {
    headerRow.append(`<td>${code}<br>${name}</td>`);
  }
  curriculumGrid.append(headerRow);

  for (const [RA, { enrolled }] of Object.entries(students)) {
    const row = $("<tr>").append(`<td>${RA}</td>`);
    for (const [code] of Object.entries(disciplines)) {
      row.append($("<td>").addClass(enrolled[code]));
    }
    curriculumGrid.append(row);
  }

  const getCellInfo = (ctx) => {
    const studentRA = $(ctx).closest("tr").find("td:first-child").text();
    const clickedDisciplineIndex = $(ctx).index() + 1;
    const disciplineCode = $("#curriculum-grid tr:first")
      .find(`td:nth-child(${clickedDisciplineIndex})`)
      .contents()
      .filter(function () {
        return this.nodeType === 3;
      })
      .first()
      .text();
    return { studentRA, disciplineCode };
  };

  // Adicionar eventos de clique às células
  curriculumGrid.on("click", "td", function (event) {
    event.preventDefault();

    if (event.which !== 1) return; // Não é clique com botão esquerdo

    const { studentRA, disciplineCode } = getCellInfo(this);

    const lastEnrollment = getEnrollmentData(
      xmlData,
      studentRA,
      disciplineCode
    );

    alert(
      lastEnrollment
        ? `Disciplina: ${disciplineCode}\n` +
            `Última vez cursada: ${lastEnrollment.lastCursada}\n` +
            `Nota: ${lastEnrollment.nota}\n` +
            `Frequência: ${lastEnrollment.frequencia}`
        : "Sem inscrição na disciplina"
    );
  });

  curriculumGrid.on("contextmenu", "td", function (event) {
    event.preventDefault();

    const { studentRA, disciplineCode } = getCellInfo(this);
    const history = getEnrollmentHistory(xmlData, studentRA, disciplineCode);

    if (history?.length > 0) {
      let historyMessage = `Histórico para a disciplina ${disciplineCode}:\n`;

      for (let i = 0; i < history.length; i++) {
        const { anoSemestre, nota, frequencia } = history[i];

        historyMessage +=
          `Ano/Semestre: ${anoSemestre}\n` +
          `Nota: ${nota}\n` +
          `Frequência: ${frequencia}\n\n`;
      }

      alert(historyMessage);
    } else {
      alert("Sem história para a disciplina");
    }
  });
}

function getEnrollmentData(xmlData, studentRA, disciplineCode) {
  const enrollmentData = $(xmlData)
    .find("ALUNO")
    .filter(function () {
      const currentRA = $(this).find("MATR_ALUNO").text();
      const currentDisciplineCode = $(this).find("COD_ATIV_CURRIC").text();
      return (
        currentRA === studentRA && currentDisciplineCode === disciplineCode
      );
    })
    .last();

  if (!enrollmentData.length) return null;

  const lastCursada = enrollmentData.find("PERIODO").text();
  const nota = enrollmentData.find("MEDIA_FINAL").text();
  const frequencia = enrollmentData.find("FREQUENCIA").text();

  return { lastCursada, nota, frequencia };
}

function getEnrollmentHistory(xmlData, studentRA, disciplineCode) {
  const enrollmentHistory = [];

  $(xmlData)
    .find("ALUNO")
    .each(function () {
      const currentRA = $(this).find("MATR_ALUNO").text();
      const currentDisciplineCode = $(this).find("COD_ATIV_CURRIC").text();

      if (currentRA === studentRA && currentDisciplineCode === disciplineCode) {
        const anoSemestre = $(this).find("PERIODO").text();
        const nota = $(this).find("MEDIA_FINAL").text();
        const frequencia = $(this).find("FREQUENCIA").text();

        enrollmentHistory.push({ anoSemestre, nota, frequencia });
      }
    });

  return enrollmentHistory;
}
