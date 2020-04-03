let all = 20;

let i = 0;

function wr(num, ch) {
  let out = '';

  for (let j = 0; j < num; j++) {
    out += ch;
  }

  return out;
}

setInterval(function() {
  process.stdout.write(wr(i, '|') + wr(all - i, '-') + '\r');
  i++;
}, 1000);

process.stdout.write('!\n')