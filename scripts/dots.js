function setLevelEditing(editable) {
  if (aiPreviewState) editable = false;
  levelEditMode = editable;
  document.getElementById('sheet')?.classList.toggle('level-editing', editable);
  const button = document.getElementById('levelEditBtn');
  if (button) {
    button.classList.toggle('active', editable);
    button.title = editable ? 'Concluir edição de níveis' : 'Editar níveis';
    button.setAttribute('aria-label', button.title);
  }
  document.querySelectorAll('[data-dots]').forEach(container => {
    const editableDots = Boolean(xpMultiplierFor(container.dataset.dots));
    container.querySelectorAll('.dot').forEach(dot => {
      dot.disabled = !editable || !editableDots;
    });
    setDotCost(container);
  });
}

function makeDots(container) {
  const path = container.dataset.dots;
  const label = container.dataset.label;
  const max = Number(container.dataset.max || 5);
  const description = fieldDescriptions[path] || '';
  const symbol = sphereSymbols[path] || '';
  container.className = 'dot-row';
  container.innerHTML = '<span class="dot-label"></span><span class="xp-cost"></span><span class="dots"></span>';
  const labelElement = container.querySelector('.dot-label');
  if (symbol) {
    const symbolElement = document.createElement('span');
    symbolElement.className = 'sphere-symbol';
    symbolElement.textContent = symbol;
    labelElement.append(symbolElement, document.createTextNode(label));
  } else {
    labelElement.textContent = label;
  }
  if (description) {
    labelElement.title = description;
  }
  const dots = container.querySelector('.dots');
  for (let i = 1; i <= max; i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dot';
    dot.title = `${label}: ${i}`;
    dot.setAttribute('aria-label', `${label}: ${i}`);
    dot.addEventListener('mouseenter', () => {
      if (!isDotSectionEditable(container)) return;
      const current = Number(getPath(state, path, 0));
      const target = current === i ? Math.max(0, i - 1) : i;
      setDotCost(container, target);
    });
    dot.addEventListener('mouseleave', () => setDotCost(container));
    dot.addEventListener('click', () => {
      if (!isDotSectionEditable(container)) return;
      const current = Number(getPath(state, path, 0));
      const target = current === i ? Math.max(0, i - 1) : i;
      if (creationMode && !canSetCreationLevel(path, target)) return;
      const cost = dotChangeCost(path, current, target);
      const experience = currentExperience();

      if (cost > experience) {
        setExperienceError(creationMode ? 'Freebies insuficientes para aumentar esse nível.' : 'Experiência insuficiente para aumentar esse nível.');
        return;
      }

      setPath(state, path, target);
      if (creationMode) {
        setFreebies(experience - cost);
      } else {
        setExperience(experience - cost);
      }
      renderDots(container);
      renderCreationSummary();
      updateAllDotCosts();
      updateLineageSphereBonusButton();
    });
    dots.appendChild(dot);
  }
  renderDots(container);
}

function bindLevelEditor() {
  document.getElementById('levelEditBtn')?.addEventListener('click', () => {
    setLevelEditing(!levelEditMode);
  });
  setLevelEditing(false);
}

function isLineageBonusDot(path, idx, value) {
  if (!creationMode || !path.startsWith('spheres.')) return false;
  const bonus = state.creation?.lineageSphereBonus?.[path.split('.')[1]];
  if (!bonus) return false;
  return idx < value && idx >= Number(bonus.from || 0) && idx < Number(bonus.to || 0);
}

function renderDots(container) {
  const path = container.dataset.dots;
  const value = Number(effectiveValue(path, 0));
  container.classList.toggle('ai-suggested', isAiSuggestionChanged(path));
  container.querySelectorAll('.dot').forEach((dot, idx) => {
    dot.classList.toggle('filled', idx < value);
    dot.classList.toggle('lineage-bonus-dot', isLineageBonusDot(path, idx, value));
    dot.classList.toggle('ai-suggested', isAiSuggestionChanged(path) && idx < value);
  });
  setDotCost(container);
}
