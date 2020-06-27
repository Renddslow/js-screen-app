const handleSubmit = (e) => {
  e.preventDefault();
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

(() => {
  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.addEventListener('change', onRadioChange(r));
  });
})();
