const fs = require("fs");
const path = require("path");
const LENGTH = 2;

function getGBK(data, p) {

  let res = Array.from(fs.readFileSync(p));
  let count = Math.floor(res.length / LENGTH);
  
  const out = Array.from(res);
  for (let i = 0; i < count * LENGTH; i += LENGTH) {
    const temp = [];
    for (let j = 0; j < LENGTH; j++) {
      temp.push((255 - out[i + j]) / 50);
    }
    data.gkb.push(temp);
  }
  console.log(data.gkb.length);
}

function getUTF8(data, p) {
  let res = Array.from(fs.readFileSync(p));
  let count = Math.floor(res.length / LENGTH);

  const out = Array.from(res);
  for (let i = 0; i < count; i += LENGTH) {
    const temp = [];
    for (let j = 0; j < LENGTH; j++) {
      temp.push((255 - out[i + j]) / 50);
    }
    data.utf8.push(temp);
  }
  console.log(data.utf8.length);
}

function getAscII(data, p) {

  let res = Array.from(fs.readFileSync(p));
  let count = Math.floor(res.length / LENGTH);

  const out = Array.from(res);
  for (let i = 0; i < count; i += LENGTH) {
    const temp = [];
    for (let j = 0; j < LENGTH; j++) {
      temp.push((255 - out[i + j]) / 50);
    }
    data.ascii.push(temp);
  }
  console.log(data.ascii.length);
}

const getFIleContent = () => {
  const data = { gkb: [], utf8: [], ascii: [] };

  getGBK(data, path.resolve(__dirname, "../files/check-charset/gbk/gbk.txt"));
  getGBK(data, path.resolve(__dirname, "../files/check-charset/gbk/gb2312.txt"));

  getUTF8(data, path.resolve(__dirname, "../files/check-charset/utf-8/gbk.txt"));
  getUTF8(data, path.resolve(__dirname, "../files/check-charset/utf-8/gb2312.txt"));

  getGBK(data, path.resolve(__dirname, "../files/check-charset/gbk.txt"));
  getUTF8(data, path.resolve(__dirname, "../files/check-charset/utf-8.txt"));

  getAscII(data, path.resolve(__dirname, "../files/check-charset/ascii/1.txt"));

  console.log("all");
  console.log(data.gkb.length);
  console.log(data.utf8.length);
  console.log(data.ascii.length)
  fs.writeFileSync(
    path.resolve(__dirname, "../data/data.json"),
    JSON.stringify(data)
  );
};

exports.getFIleContent = getFIleContent;
