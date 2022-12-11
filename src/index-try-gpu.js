const tf = require("@tensorflow/tfjs-node");
const data = require("../data/data.json");
const lodash = require("lodash");

void (async function () {
  // 连续的 上一层的输出必然是下一层的输入
  const model = tf.sequential();
  // 全连接层 隐藏层
  model.add(
    tf.layers.dense({
      units: 10,
      inputShape: [
        2,
      ] /* 每一份训练数据有两个元素，且训练数据最外层必须是数组 */,
      activation: "relu", // 带来非线性的变化 如果不加激活函数，线性的还是线性的不会有变化
    })
  );

  for (let i = 0; i < 2; i++) {
    model.add(
      tf.layers.dense({
        units: 10,
        activation: "relu", // 带来非线性的变化 如果不加激活函数，线性的还是线性的不会有变化
      })
    );
  }

  // 全连接层 输出层
  model.add(
    tf.layers.dense({
      units: 3,
      activation: "softmax", // 带来非线性的变化
    })
  );

  model.compile({
    // loss: "binaryCrossentropy", // 损失函数 本质上是一个逻辑回归
    loss: "categoricalCrossentropy",
    optimizer: tf.train.adam(0.01) /* adam会自动调整学习率也就是步长 */,
    metrics: ["accuracy"],
  });

  const inputs = tf.tensor([...data.gkb, ...data.utf8, ...data.ascii]);
  const labels = tf.tensor([
    ...data.gkb.map(() => [1, 0, 0]),
    ...data.utf8.map(() => [0, 1, 0]),
    ...data.ascii.map(() => [0, 0, 1]),
  ]);

  const testData = lodash.cloneDeep(data);
  testData.gkb = testData.gkb.map((n) => [...n, 0]);
  testData.utf8 = testData.utf8.map((n) => [...n, 1]);
  testData.ascii = testData.ascii.map((n) => [...n, 2]);

  const rate = 0.2;
  let tensors = [
    ...lodash.sampleSize(testData.gkb, testData.gkb.length * rate),
    ...lodash.sampleSize(testData.utf8, testData.utf8.length * rate),
    ...lodash.sampleSize(testData.ascii, testData.ascii.length * rate),
  ];
  const value = tensors.map((n) => {
    if (n[2] === 0) {
      return [1, 0, 0];
    } else if (n[2] === 1) {
      return [0, 1, 0];
    } else if (n[2] === 2) {
      return [0, 0, 1];
    }
  });
  tensors = tensors.map((n) => [n[0], n[1]]);
  const inputTest = tf.tensor(tensors);
  const valueTest = tf.tensor(value);

  await model.fit(inputs, labels, {
    // 一批 每次梯度更新的样本数
    batchSize: 100000,
    // 在训练数据阵列上迭代的整数次数。
    // epochs: 500, // 训练多少轮
    epochs: 500, // 训练多少轮
    validationData: [inputTest, valueTest],
    // validationSplit: 0.2,

    // https://tensorflow.google.cn/js/guide/nodejs?hl=zh-cn
    // callbacks: tf.node.tensorBoard(path.resolve(__dirname, './log/fit_logs_1'))

    // https://tensorflow.google.cn/js/tutorials/setup?hl=zh-cn
    callbacks: {
      onEpochEnd: (epoch, log) => {
        console.log(`Epoch ${epoch}: loss = ${log.loss}`);
        console.log(log.acc);
        // if (log.acc >= 0.963) {
        //   model.stopTraining = true;
        // }
      },
    },
  });
  // https://tensorflow.google.cn/js/guide/save_load?hl=zh-cn
  await model.save("file://./model");
})();
