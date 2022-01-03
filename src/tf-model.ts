import * as tf from '@tensorflow/tfjs';
import type { Color, Pair } from "./models";

//setup model
const model = tf.sequential();

const hidden = tf.layers.dense({
    units: 16,
    activation: 'sigmoid',
    inputDim: 3
});

const output = tf.layers.dense({
    units: 6,
    activation: 'softmax',
});

model.add(hidden);
model.add(output);

//create optimizer
const lr = 0.7;
const optimizer = tf.train.sgd(lr);

//compile the model
model.compile({
    optimizer,
    loss: 'categoricalCrossentropy'
});


//train the model

export const train = async (trainingPairs: Pair[]) => {
    const colors = [];
    const labels = [];
    for(let pair of trainingPairs) {
        const rawColor = pair[0];
        const col = [
            rawColor.r / 255, rawColor.g / 255, rawColor.b / 255
        ];
        colors.push(col);

        labels.push(pair[1]);
    }
    

    const xs = tf.tensor2d(colors);

    const labelsTensor = tf.tensor1d(labels, 'int32');

    const ys = tf.oneHot(labelsTensor, 6);

    const trainIteration = await model.fit(xs, ys, {
        epochs: 50,
        shuffle: true,
        validationSplit: 0.1,
        callbacks: {
            onBatchEnd: async () => {
                await tf.nextFrame();
            }
        }
    });
}

export const predict = (color: Color): number => {
    const xs = tf.tensor2d([[
        color.r / 255, color.g / 255, color.b / 255
    ]]);
    const results = model.predict(xs);
    const index = tf.argMax([].concat(results)[0], 1).dataSync();

    console.log('predicting');

    return Number(index[0]);
}