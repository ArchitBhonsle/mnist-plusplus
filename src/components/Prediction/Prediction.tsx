import { useEffect, useState } from "react";
import { useModel } from "../../lib/model";

import * as tf from "@tensorflow/tfjs";
import { Canvas } from "./Canvas";

const models = {
  neuraljs: "Neural Network",
  cnnjs: "Convolutional Neural Network",
};

export const Prediction = () => {
  const [modelName, setModelName] = useState("neuraljs");
  const { model, loading: modelLoading } = useModel(modelName);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [inference, setInference] = useState<number | undefined>();

  useEffect(() => {
    if (!imageData || !model) return;

    tf.tidy(() => {
      const image = tf
        .tensor3d(
          new Uint8Array(imageData.data.buffer),
          [imageData.width, imageData.height, 4],
          "float32"
        )
        .slice([0, 0, 3])
        .resizeNearestNeighbor([28, 28])
        .divNoNan(255)
        .reshape([1, 28, 28, 1]);

      const probsTensor = (model!.predict(image) as tf.Tensor).softmax();
      probsTensor.print();

      setInference(probsTensor.argMax(1).dataSync()[0]);
    });
  }, [model, imageData]);

  if (modelLoading) {
    return <div>Loading</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        textAlign: "center",
      }}
    >
      <div>
        <label htmlFor="modelName">Select the of model: </label>
        <select
          name="modelName"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        >
          {Object.entries(models).map(([modelName, modelDisplayname]) => (
            <option key={modelName} value={modelName}>
              {modelDisplayname}
            </option>
          ))}
        </select>
      </div>
      <div>Draw on the canvas to see what the model predicts!</div>
      <Canvas setImageData={setImageData} />
      {inference && <div>It's a {inference}</div>}
    </div>
  );
};
