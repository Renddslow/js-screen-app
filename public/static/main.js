const handleSubmit = (e) => {
  e.preventDefault();
  const names = [];
  const questions = [];
  for (const el of e.target.elements) {
    if (el.type === 'radio' && !names.includes(el.name)) {
      names.push(el.name);
    }
    if (el.type === 'textarea' && el.id) {
      questions.push({
        id: el.id,
        value: el.value,
      });
    }
  }

  const data = {
    type: 'survey-response',
    attributes: {
      tools: names.map((n) => ({
        id: n,
        value: parseInt(e.target.elements[n].value, 10) || 0,
      })),
      questions,
    },
  };

  fetch(`http://localhost:8080/surveys/${e.target.dataset.id}/responses`, {
    method: 'POST',
    body: JSON.stringify({ data }),
    headers: { 'Content-Type': 'application/json' },
  }).then(() => {
    console.log('😂');
  });
};

const onRadioChange = (r) => () => {
  r.parentElement.className += ' selected';
  document.querySelectorAll(`[name="${r.name}"]`).forEach((p) => {
    if (p.id !== r.id) {
      p.parentElement.className = p.parentElement.className
        .split(' ')
        .filter((c) => c !== 'selected')
        .join(' ');
    }
  });
};

const closeDialog = (e) => {
  e.preventDefault();
  document.getElementById('confirmation-dialog').style.display = 'none';
  document.getElementById('cancel').removeEventListener('click', closeDialog);
};

const openDialog = (e) => {
  e.preventDefault();
  document.getElementById('confirmation-dialog').style.display = 'block';
  document.getElementById('cancel').addEventListener('click', closeDialog);
};

(() => {
  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.addEventListener('change', onRadioChange(r));
  });

  document.getElementById('opt-out').addEventListener('click', openDialog);
  document.getElementById('screening').addEventListener('submit', handleSubmit);
})();
