/**
 * Test Model
 *
 */
const fs = require("fs");
const path = require("path");
const tf = require("@tensorflow/tfjs");
// Cancel using GPU computing due to GPU driver installation failure on windows
// const tf = require("@tensorflow/tfjs-node-gpu");
require("@tensorflow/tfjs-node");
const LENGTH = 2;

function toNonExponential(num) {
  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
}

void (async function () {
  // use model
  // Test current model
  // const model = await tf.loadLayersModel("file://./model/model.json");

  // Test perfect model
  // const model = await tf.loadLayersModel("file://./models/perfect-model/model.json");
  const model = await tf.loadLayersModel(
    "file://./models/good-model/model-pre/model.json"
  );

  let arr = [
    { path: "./files/test/gbk/1.txt", type: 0 },
    { path: "./files/test/gbk/2.txt", type: 0 },
    { path: "./files/test/gbk/3.txt", type: 0 },
    { path: "./files/test/gbk/4.txt", type: 0 },
    { path: "./files/test/gbk/5.txt", type: 0 },
    { path: "./files/test/gbk/6.txt", type: 0 },
    { path: "./files/test/gbk/7.txt", type: 0 },
    { path: "./files/test/gbk/8.txt", type: 0 },
    { path: "./files/test/gbk/9.txt", type: 0 },

    { path: "./files/test/utf-8/1.txt", type: 1 },
    { path: "./files/test/utf-8/2.txt", type: 1 },
    { path: "./files/test/utf-8/3.txt", type: 1 },
    { path: "./files/test/utf-8/4.txt", type: 1 },
    { path: "./files/test/utf-8/5.txt", type: 1 },
    { path: "./files/test/utf-8/6.txt", type: 1 },
    { path: "./files/test/utf-8/7.txt", type: 1 },
    { path: "./files/test/utf-8/8.txt", type: 1 },
    { path: "./files/test/utf-8/9.txt", type: 1 },

    // { path: "", type:  },
    { path: "./files/test/other/gbk.txt", type: 0 },
    { path: "./files/test/other/utf-8.txt", type: 1 },

    // ASCII encode with GBK or UTF-8 are all right
    { path: "./files/test/ascii/1.txt", type: [0, 1] },
    { path: "./files/test/ascii/2.txt", type: [0, 1] },
    { path: "./files/test/ascii/3.txt", type: [0, 1] },
    { path: "./files/test/ascii/4.txt", type: [0, 1] },
  ];

  let allres = [];

  for (let n of arr) {
    let content = fs.readFileSync(n.path);
    content = Array.from(content);
    let all = [];
    let count = Math.floor(content.length / LENGTH);
    for (let i = 0; i < count * LENGTH; i += LENGTH) {
      const temp = [];
      for (let j = 0; j < LENGTH; j++) {
        temp.push((255 - content[i + j]) / 50);
      }
      let res = model.predict(tf.tensor([temp])).dataSync();
      res = res
        .toString()
        .split(",")
        .map((n) => Number(n));
      all.push(res);
    }
    console.log(n);
    allres.push({ res: all, source: n });
    let rr = [0, 0, 0];
    let r0 =
      all.reduce((p, c) => {
        return p + c[0];
      }, 0) / all.length;
    rr[0] = r0;

    let r1 =
      all.reduce((p, c) => {
        return p + c[1];
      }, 0) / all.length;
    rr[1] = r1;

    let r2 =
      all.reduce((p, c) => {
        return p + c[2];
      }, 0) / all.length;
    rr[2] = r2;

    let calc = rr[0] > rr[1] ? 0 : 1;

    if (typeof n.type === "number") {
      console.log(calc, calc === n.type ? "success" : "failed", n.path);
    } else {
      console.log(calc, n.type.includes(calc) ? "success" : "failed", n.path);
    }

    if (
      (typeof n.type === "number" && calc !== n.type) ||
      (Array.isArray(n.type) && !n.type.includes(calc))
    ) {
      console.log(rr);
    }
    // if (Array.isArray(n.type)) {
    //   console.log(rr)
    // }
  }
  fs.writeFileSync(
    path.resolve(__dirname, "../data/allres.json"),
    JSON.stringify(allres, null, 4)
  );
})();
