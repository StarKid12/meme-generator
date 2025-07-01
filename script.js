let image = null;
let textBoxes = [];

function resizeCanvas() {
  const canvas = document.getElementById('memeCanvas');
  const maxWidth = Math.min(window.innerWidth - 40, 500);

  if (image) {
    const ratio = image.naturalWidth / image.naturalHeight;
    const width = maxWidth;
    const height = width / ratio;
    canvas.width = width;
    canvas.height = height;
    return { width, height };
  } else {
    canvas.width = 500;
    canvas.height = 500;
    return { width: 500, height: 500 };
  }
}


function drawMeme() {
  const canvas = document.getElementById('memeCanvas');
  const ctx = canvas.getContext('2d');
  resizeCanvas();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!image) return;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 32px Arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';

  const lineHeight = 36;
  const maxWidth = canvas.width - 40;

  textBoxes.forEach((box, i) => {
    const text = document.getElementById(`text${i}`).value;
    const x = parseInt(document.getElementById(`x${i}`).value);
    const y = parseInt(document.getElementById(`y${i}`).value);
    drawMultilineText(ctx, text, x, y, maxWidth, lineHeight);
  });
}

function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = [];

  text.split('\n').forEach(paragraph => {
    let words = paragraph.split(' ');
    let line = '';
    for (let i = 0; i < words.length; i++) {
      let testLine = line + words[i] + ' ';
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(line);
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
  });

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + (i * lineHeight));
    ctx.strokeText(lines[i], x, y + (i * lineHeight));
  }
}

function addTextBox(defaultText = '', defaultX = 250, defaultY = 40) {
  const canvas = document.getElementById('memeCanvas');
  const index = textBoxes.length;
  textBoxes.push(index);

  const inputContainer = document.getElementById('textInputs');
  const sliderContainer = document.getElementById('positionSliders');

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.id = `text${index}`;
  textInput.placeholder = `Text ${index + 1}`;
  textInput.value = defaultText;
  textInput.addEventListener('input', drawMeme);
  inputContainer.appendChild(textInput);

  ['x', 'y'].forEach(axis => {
    const label = document.createElement('label');
    label.textContent = `Text ${index + 1} ${axis.toUpperCase()}`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = axis === 'x' ? canvas.width : canvas.height;
    slider.value = axis === 'x' ? defaultX : defaultY;
    slider.id = `${axis}${index}`;
    slider.addEventListener('input', drawMeme);

    sliderContainer.appendChild(label);
    sliderContainer.appendChild(slider);
  });

  drawMeme();
}


function resetMeme() {
  image = null;
  textBoxes = [];
  document.getElementById('textInputs').innerHTML = '';
  document.getElementById('positionSliders').innerHTML = '';
  document.getElementById('templateSelect').value = '';
  document.getElementById('uploadSection').style.display = 'block';
  const canvas = document.getElementById('memeCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function downloadMeme() {
  const canvas = document.getElementById('memeCanvas');
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
}

// Upload from file

document.getElementById('imageInput').addEventListener('change', function(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    image = new Image();
    image.onload = function() {
      document.getElementById('uploadSection').style.display = 'none';
      textBoxes = [];
      document.getElementById('textInputs').innerHTML = '';
      document.getElementById('positionSliders').innerHTML = '';
      addTextBox('', 250, 40);
      drawMeme();
    }
    image.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
});

// Template select

document.getElementById('templateSelect').addEventListener('change', function(e) {
  const selected = e.target.value;
  if (selected) {
    image = new Image();
    image.onload = function() {
      document.getElementById('uploadSection').style.display = 'none';
      textBoxes = [];
      document.getElementById('textInputs').innerHTML = '';
      document.getElementById('positionSliders').innerHTML = '';
      if (selected === 'distracted') {
        addTextBox('Boyfriend', 300, 100);
        addTextBox('Other Girl', 140, 230);
        addTextBox('Girlfriend', 410, 210);
      } else if (selected === 'spongebob_paper') {
         addTextBox('Text', 115, 145);
      } else if (selected === 'boardroom') {
         addTextBox('Text 1', 310, 40);
         addTextBox('Text 2', 75, 280);
         addTextBox('Text 3', 206, 285);
         addTextBox('Text 4', 379, 300);
      } else if (selected === 'drake' || selected === 'pooh' || selected === 'running_man'){
         addTextBox('Top Text', 375, 115);
         addTextBox('Bottom Text', 375, 390);
      } else if (selected === 'excited_then_disappointed'){
         addTextBox('Top Text', 175, 100);
         addTextBox('Bottom Text', 175, 240);
      } else if (selected === 'strong_weak_doge') {
         addTextBox('Text 1', 175, 150);
         addTextBox('Text 2', 400, 200);
      } else if (selected === 'i_sleep_real') {
         addTextBox('Top Text', 125, 115);
         addTextBox('Bottom Text', 125, 390);
       }  else if (selected === 'gru_plan') {
         addTextBox('Text 1', 195, 100);
         addTextBox('Text 2', 445, 100);
         addTextBox('Text 3', 195, 275);
         addTextBox('Text 4', 445, 275);
      } else if (selected === 'spongebob_monster') {
         addTextBox('Monster', 225, 100);
         addTextBox('Scared', 375, 400);
         addTextBox('Bored', 195, 440);
      } else if (selected === 'batman') {
         addTextBox('Text 1', 125, 40);
         addTextBox('Text 2', 400, 40);
      } else if (selected === 'woman_yelling_cat' || selected === 'split_path') {
         addTextBox('Text 1', 125, 75);
         addTextBox('Text 2', 400, 75);
      } else if (selected === 'disaster_girl') {
         addTextBox('Text', 125, 75);
      } else if (selected === 'uno_card') {
         addTextBox('Text', 130, 225);
      } else if (selected === 'highway') {
         addTextBox('Text 1', 165, 125);
         addTextBox('Text 2', 315, 125);
      } else if (selected === 'trump_order') {
         addTextBox('Text 1', 270, 250);
         addTextBox('Text 2', 410, 250);
      } else if (selected === 'heart') {
        addTextBox('Text 1', 140, 105);
        addTextBox('Text 2', 140, 245);
        addTextBox('Text 3', 140, 380);
      } else if (selected === 'hydra') {
        addTextBox('Text 1', 100, 200);
        addTextBox('Text 2', 250, 175);
        addTextBox('Text 3', 400, 200);
      } else if (selected === 'bike') {
        addTextBox('Text 1', 325, 125);
        addTextBox('Text 2', 140, 375);
        addTextBox('Text 3', 140, 625);
      } else if (selected === 'brain') {
        addTextBox('Text 1', 135, 100);
        addTextBox('Text 2', 135, 275);
        addTextBox('Text 3', 135, 450);
        addTextBox('Text 4', 135, 625);
      } else if (selected === 'pool') {
         addTextBox('Text 1', 450, 200);
         addTextBox('Text 2', 250, 150);
         addTextBox('Text 3', 115, 300);
         addTextBox('Text 4', 260, 500);
      } else if (selected === 'spongebob_muscle_chart') {
         addTextBox('Text 1', 375, 100);
         addTextBox('Text 2', 375, 260);
         addTextBox('Text 3', 375, 420);
         addTextBox('Text 4', 375, 580);
         addTextBox('Text 5', 375, 740);
      } else {
         addTextBox('Top Text', 250, 40);
         addTextBox('Bottom Text', 250, 460);
      }
      drawMeme();
    }
    image.src = './' + selected + '.jpg';
  }
});