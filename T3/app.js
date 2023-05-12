$(document).ready(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let lines = [{ x1: 200, y1: 300, x2: 600, y2: 300 }];
    let isMouseDown = false;

    const drawLines = () => 
        lines.forEach(({ x1, x2, y1, y2 }) => {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        });

    drawLines(lines);

    canvas.addEventListener('mousedown', () => {
        isMouseDown = true;
    });

    canvas.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    canvas.addEventListener('mousemove', e => {
        if (!isMouseDown) return;
        const { left, top } = canvas.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        lines.forEach(({ x1, x2, y1, y2 }, index) => {
            if (Math.abs(x - x1) < 10 && Math.abs(y - y1) < 10) {
                lines[index].x1 = x;
                lines[index].y1 = y;
            } else if (Math.abs(x - x2) < 10 && Math.abs(y - y2) < 10) {
                lines[index].x2 = x;
                lines[index].y2 = y;
            } else {
                const dx = x - (x1 + x2) / 2;
                const dy = y - (y1 + y2) / 2;
                lines[index].x1 += dx;
                lines[index].y1 += dy;
                lines[index].x2 += dx;
                lines[index].y2 += dy;
            }
        });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLines(lines);
    });

    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();

        const { left, top } = canvas.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        lines.forEach(({ x1, x2, y1, y2 }, index) => {
            lines[index] = { x1, y1, x2: x, y2: y };
            lines[index + 1] = { x1: x, y1: y, x2, y2 };
        });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLines(lines);

        return false;
    });
});