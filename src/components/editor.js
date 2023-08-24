import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { langs } from '@uiw/codemirror-extensions-langs';
import parseCSS from 'css-rules';
import { css } from 'js-beautify';
import CSSLint from 'csslint';
import _ from 'lodash';

if (typeof window !== `undefined`) {
    window.CSSLint = CSSLint.CSSLint;
}

const initialEditorOptions = {
    value: `/* PASTE CSS HERE */

example1 {
  height: 5px;
  width: 10px;
  background: gray;
  border-width: 1px;
  border-radius: 3px;
  /* Complex/Shorthand styles Not supported*/
  padding: 5px 10px;
}

example2 {
  position: absolute;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
    data: {},
    editor: {},
};

const debouncedUpdateTree = _.debounce(
    (setCssTree, parse, value, setEditorErrors, errors) => {
        setCssTree(parse(value));
        setEditorErrors(errors);
        console.log(errors);
    },
    500
);

const Editor = ({ setCssTree, setEditorErrors }) => {
    const [editorState, setEditorState] = useState(initialEditorOptions);
    const tidy = () => {
        try {
            setEditorState(() => {
                return {
                    ...editorState,
                    value: css(editorState.value),
                };
            });

            console.log(css(editorState.value))
        } catch (e) {
            console.log('error formatting', e);
        }
    };
    const parse = (cssString) => {
        try {
            return parseCSS(cssString);
        } catch (e) {
            console.error('error parsing CSS', e);
        }
    };

    return (
        <div className="relative h-full w-5/12">
            <div className='absolute top-1 right-12 z-10'>
                <select className='w-20'>
                    <option value="css">css</option>
                    <option value="scss">scss</option>
                    <option value="less">less</option>
                </select>
            </div>
            <div
                className="absolute top-0 right-0 m-2 z-10 cursor-pointer text-gray-500 hover:text-gray-100"
                onClick={() => {
                    tidy();
                }}
            >
                <div class="font-bold" style={{ fontSize: '0.5rem' }}>
                    TIDY
                </div>
                <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="w-6 h-4"
                >
                    <path d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            </div>
            {typeof window !== 'undefined' && window?.navigator && (
                <CodeMirror
                    value={editorState.value}
                    height="1200px"
                    theme={vscodeDark}
                    options={{
                        mode: 'css',
                        theme: 'material',
                        lineNumbers: true,
                        matchBrackets: true,
                        autoCloseBrackets: true,
                        gutters: ['CodeMirror-lint-markers'],
                        lint: true,
                    }}
                    extensions={[langs.css()]}
                    // onBeforeChange={(editor, data, value) => {
                    //     setEditorState({ editor, data, value });
                    // }}
                    // editorDidMount={(editor, [next]) => {
                    //     debouncedUpdateTree(
                    //         setCssTree,
                    //         parse,
                    //         initialEditorOptions.value,
                    //         setEditorErrors,
                    //         editor.state.lint.marked.length > 0
                    //     );
                    // }}
                    onChange={(value, editor) => {
                        console.log(value, editor)
                
                        debouncedUpdateTree(
                            setCssTree,
                            parse,
                            value,
                            setEditorErrors,
                            false
                        );
                        // setCssTree(parse(value));
                        // setEditorErrors(editor.state.lint.marked.length > 0);
                        // console.log(editor, data, parse(value));
                    }}
                    onUpdate={() => {
                        console.log('update')
                    }}
                    onCreateEditor={() => {
                        console.log('onCreateEditor')

                        debouncedUpdateTree(
                            setCssTree,
                            parse,
                            editorState.value,
                            setEditorErrors,
                            false
                        );
                    }}
                />
            )}
        </div>
    );
};

export default Editor;
