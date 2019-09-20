import React,{Component,useState} from 'react';
import { Tensor, InferenceSession } from "onnxjs";

const OnnxAdd = () => {
  const start = new Date();
  const [addResult, setAddResult] = useState('')

  const run = async () => {
    setAddResult('running.....')

    // Create an ONNX inference session with default backend.
    const session = new InferenceSession({ backendHint: 'webgl' });
    // Load an ONNX model. This model is Resnet50 that takes a 1*3*224*224 image and classifies it.
    await session.loadModel("./onnx/add.onnx");
  
    const x = new Float32Array(3 * 4 * 5).fill(1);
    const y = new Float32Array(3 * 4 * 5).fill(2);
    const tensorX = new Tensor(x, 'float32', [3, 4, 5]);
    const tensorY = new Tensor(y, 'float32', [3, 4, 5]);
  
    // Run model with Tensor inputs and get the result by output name defined in model.
    const outputMap = await session.run([tensorX, tensorY]);
    const outputData = outputMap.get('sum');
  
    // Check if result is expected.
    if (!outputData.data.every((value) => value === 3)) {
      setAddResult(`Error: Data mismatch!`);
      return;
    }
    if (outputData.data.length !== 3 * 4 * 5) {
      setAddResult(`Error: Expected length of ${3 * 4 * 5} but got ${outputData.data.length}`);
      return;
    }
    const end = new Date();
    const inferenceTime = (end.getTime() - start.getTime());

    setAddResult(`Got an Tensor of size ${outputData.data.length} with all elements being ${outputData.data[0]}   --- time:${inferenceTime} `);
  }

  return (
    <div>
      <h1>Tensor-Add Example</h1>
      <div>
        <p>Tensor 1: dims=[3,4,5], initialized to: 1's</p>
        <p>Tensor 2: dims=[3,4,5], initialized to: 2's</p>
        <div>
          <button onClick={async () => await run()}>Run</button>
        </div>
        <p>{addResult}</p>
      </div>
    </div>
  );
};


export default OnnxAdd