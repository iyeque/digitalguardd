// Generates a 1080x1080 Canvas image celebrating Elise's session for sharing.
const PALETTES = ["#9CBFA7", "#F2CA7E", "#E89D8A", "#A1BCE3", "#F0B8C6"];

const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > maxWidth && i > 0) {
      ctx.fillText(line, x, yy);
      line = words[i] + ' ';
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, yy);
  return yy;
};

export const buildShareCard = ({ childName, activities, totalTaps, minutesPlayed, earnedCount, achievementCount, mode }) => {
  const W = 1080, H = 1080;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const isWeek = mode === 'week';
  const name = childName || 'Elise';

  // background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#FDFBF7');
  bg.addColorStop(1, '#F3EFE6');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // soft accent blobs
  const blob = (cx, cy, r, color, alpha) => {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalAlpha = alpha;
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  };
  blob(150, 200, 380, '#9CBFA7', 0.45);
  blob(950, 260, 360, '#F2CA7E', 0.40);
  blob(900, 920, 380, '#F0B8C6', 0.40);
  blob(180, 880, 360, '#A1BCE3', 0.40);

  // central white card
  const cardX = 80, cardY = 110, cardW = W - 160, cardH = H - 220;
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#EAE3D9';
  ctx.lineWidth = 6;
  roundRect(ctx, cardX, cardY, cardW, cardH, 56, true, true);

  // shadow under card
  ctx.fillStyle = 'rgba(234, 227, 217, 1)';
  roundRect(ctx, cardX, cardY + cardH + 8, cardW, 22, 56, true, false);

  // header pill
  ctx.fillStyle = isWeek ? '#A1BCE3' : '#9CBFA7';
  roundRect(ctx, W / 2 - 240, cardY + 60, 480, 70, 35, true, false);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 30px "Nunito", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${name.toUpperCase()} LEARNS · ${isWeek ? 'WEEK' : 'TODAY'}`, W / 2, cardY + 105);

  // title
  ctx.fillStyle = '#5A524D';
  ctx.font = '700 90px "Fredoka", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(isWeek ? "This week's" : "Today's magic", W / 2, cardY + 240);
  ctx.fillText(`with ${name}`, W / 2, cardY + 330);

  // stat circles row
  const stats = [
    { val: String(totalTaps || 0), label: 'Total taps' },
    { val: `${minutesPlayed || 1} min`, label: isWeek ? 'This week' : 'Today' },
    { val: `${earnedCount}/${achievementCount}`, label: 'Stickers' },
  ];
  const statsY = cardY + 440;
  const statSpacing = (cardW - 160) / stats.length;
  stats.forEach((s, i) => {
    const cx = cardX + 80 + statSpacing / 2 + statSpacing * i;
    ctx.fillStyle = PALETTES[i % PALETTES.length];
    ctx.beginPath(); ctx.arc(cx, statsY, 100, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 56px "Fredoka", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.val, cx, statsY);
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#5A524D';
    ctx.font = '700 26px "Nunito", system-ui, sans-serif';
    ctx.fillText(s.label, cx, statsY + 150);
  });

  // activities played caption
  const playedTitles = (activities || []).filter(a => a.opened).map(a => a.title);
  ctx.fillStyle = '#5A524D';
  ctx.font = '600 30px "Nunito", system-ui, sans-serif';
  ctx.textAlign = 'center';
  const captionY = statsY + 240;
  if (playedTitles.length) {
    wrapText(ctx, `Activities: ${playedTitles.join(' · ')}`, cardX + 80, captionY, cardW - 160, 42);
  } else {
    ctx.fillText('Just getting started!', W / 2, captionY);
  }

  // signature
  ctx.fillStyle = '#8A817C';
  ctx.font = '700 22px "Nunito", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('eliselearns.app', W / 2, cardY + cardH - 44);

  return c;
};

const roundRect = (ctx, x, y, w, h, r, fill, stroke) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
};

export const downloadCanvas = (canvas, filename = 'elise-magic-moment.png') => {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
};

export const shareCanvas = async (canvas, filename = 'elise-magic-moment.png') => {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) { resolve(false); return; }
      const file = new File([blob], filename, { type: 'image/png' });
      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "Elise's magic moment",
            text: "Look what Elise learned today!",
            files: [file],
          });
          resolve(true);
          return;
        }
      } catch (_) { /* user cancelled or unsupported */ }
      // Fallback: download
      downloadCanvas(canvas, filename);
      resolve(true);
    });
  });
};
