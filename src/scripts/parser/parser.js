import TailWindMap from '../constants';
import { convertColor, isColor } from './color';
import { convertSpacing } from './spacing';
import { convertFontWeight, convertLineHeight, convertFontSize } from './text';
import { convertBorderRadius } from './border';
import { convertDimensions } from './dimensions';

/**
 * 
 * @param {*} property 
 * @param {*} value 
 * @param {*} tailWindStyles 
 * @param {*} pseudoEle 
 * @param {*} errors 
 * @param {*} settings 
 */
export const convertCss = (
    property,
    value,
    tailWindStyles,
    pseudoEle,
    errors,
    settings
) => {
    let processedProperty = processProperty(property, value);
    let processedValue = processValue(
        processedProperty,
        value,
        tailWindStyles,
        errors,
        settings
    );

    let processedPseudoElement = processPseudoElement(pseudoEle)

    console.log(processedProperty, processedValue);

    if (
        TailWindMap[processedProperty] &&
        TailWindMap[processedProperty][processedValue]
    ) {
        tailWindStyles.push(
            `${processedPseudoElement}${TailWindMap[processedProperty][processedValue].substring(1)}`
        );
    } else {
        errors.push(`${property}: ${value};`);
    }
};

const processPseudoElement = (pseudoEle) => {
    for (let key in pseudoEle) {
        if (pseudoEle[key]) {
            return key + ':'
        }
    }

    return ''
}

const processProperty = (property, value) => {
    switch (property) {
        case 'background':
            if (isColor(value)) {
                return 'background-color';
            }
            return property;
        default:
            return property;
    }
};

const processValue = (property, value, tailWindStyles, errors, settings) => {
    if (
        ['0em', '0ex', '0ch', '0rem', '0vw', '0vh', '0%', '0px'].indexOf(
            value
        ) !== -1
    ) {
        return 0;
    }
    switch (property) {
        case 'color':
        case 'background-color':
        case 'border-color':
            return convertColor(value, settings);
        case 'font-weight':
            return convertFontWeight(value);
        case 'line-height':
            return convertLineHeight(value, settings);
        case 'font-size':
            return convertFontSize(value, settings);
        case 'height':
        case 'width':
            return convertDimensions(value, settings);
        case 'padding':
        case 'margin':
        case 'padding-top':
        case 'padding-left':
        case 'padding-right':
        case 'padding-bottom':
        case 'margin-top':
        case 'margin-left':
        case 'margin-right':
        case 'margin-bottom':
            return convertSpacing(
                property,
                value,
                tailWindStyles,
                errors,
                settings
            );
        case 'border-radius':
            return convertBorderRadius(value, settings);
        default:
            return value;
    }
};

// const handleSettings = (fn, value, settings, key) => (...args) => {
//     if (!settings[key]) {
//         return value;
//     }
//     return fn(args);
// }

// JSON object that holds direct css conversions
const conversionObj = {
    'font-weight': {
        normal: 400,
        bold: 700,
    },
    height: {
        '0px': 0,
        '0%': 0,
    },
};
