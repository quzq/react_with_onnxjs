import React,{Component,useState} from 'react';
import { Tensor, InferenceSession } from "onnxjs";
import Canvas from "./Canvas";

const OnnxMnist = () => {
  const [mnistResult, setMnistResult] = useState('')

  const run = async () => {
    setMnistResult('running.....')
    const start = new Date();

    // 推論に用いるセッションの初期化
    // backendHint
    //    'cpu' :  CPUバックエンドを指定
    //    'webgl' : WebGLバックエンドを指定
    //    'wasm'  : WebAssemblyバックエンドを指定
    const session = new InferenceSession({ backendHint: 'webgl' })

    // モデルの読み込み
    await session.loadModel('./onnx/mnist.onnx')

    // input-canvasのcontextを取得
    const ctx = document.getElementById('input-canvas').getContext('2d')
    // contextに前処理を施し、入力データを作成する
    const tensor = await new Tensor((await preprocess(ctx)), 'float32', [1, 1, 28, 28]);

    // 推論の実行
    const outputData = await session.run([tensor])
    const output = outputData.values().next().value;
    //推論結果に対し、後処理を行い、値（0-9）毎の評価（一次元配列）を得る
    const rankedArray = postprocess(output)
    // 最高評価のインデックスを取得。インデックス番号がもっとの可能性の高い数字となる。
    const number = rankedArray.indexOf(Math.max.apply(null, rankedArray))
    const end = new Date();
    const inferenceTime = (end.getTime() - start.getTime());
    setMnistResult(`this is ${number}.   --- time:${inferenceTime} `);
  }

  // 前処理 canvasのコンテキストを28px×28pxにスケールし、さらに二値化（？）する
  const preprocess = async (ctx) => {
    // input-canvasのデータを28x28に変換して、input-canvas-scaledに書き込む
    // scaled to 28 x 28
    const ctxScaled = document.getElementById('input-canvas-scaled').getContext('2d')
    await ctxScaled.save();
    ctxScaled.scale(28 / ctx.canvas.width, 28 / ctx.canvas.height)
    ctxScaled.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctxScaled.drawImage(document.getElementById('input-canvas'), 0, 0)
    ctxScaled.restore()
    const imageDataScaled = await ctxScaled.getImageData(0, 0, ctxScaled.canvas.width, ctxScaled.canvas.height);
    // process image data for model input
    const { data } = imageDataScaled;
    const proccessed = new Float32Array(784);
    for (let i = 0, len = data.length; i < len; i += 4) {
      proccessed[i / 4] = data[i + 3] / 255;
    }
    return proccessed
  }

  // 後処理 
  const postprocess = (rawOutput) => {
    // ソフトマックス関数
    // 入力としてK個の実数のベクトルを受け取り、それを入力数の指数に比例するK個の確率からなる確率分布に正規化する関数(by wikipedia)
    const softmax = (arr) => {
      const C = Math.max(...arr);
      const d = arr.map((y) => Math.exp(y - C)).reduce((a, b) => a + b);
      return arr.map((value, index) => {
        return Math.exp(value - C) / d;
      });
    }
    return softmax(Array.prototype.slice.call(rawOutput.data));
  }

  const clearCanvas = () => {
    // 未実装
    //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  return (
    <div>
      <h1>Tensor-Minst Example</h1>
      <div>
        <Canvas></Canvas>
        <canvas id="input-canvas-scaled" width="28" height="28" ></canvas>
        <div>
          <button onClick={async () => await run()}>Run</button>
          <button onClick={async () => await clearCanvas()}>Clear</button>
        </div>
        <p>{mnistResult}</p>
      </div>
    </div>
  );
};

export default OnnxMnist