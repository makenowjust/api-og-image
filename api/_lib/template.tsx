import { readFileSync } from 'fs';

import * as React from "react";
import * as ReactDOM from "react-dom/server";

const icon = readFileSync(`${__dirname}/../_img/tsumugu.png`).toString('base64');
const font = readFileSync(`${__dirname}/../_font/MPLUS1p-Light.ttf`).toString('base64');

const style = `
  @font-face {
    font-family: 'M PLUS 1p';
    font-style: normal;
    font-weight: normal;
    src: url(data:application/x-font-ttf;base64,${font}) format("truetype");
  }

  html, body {
    height: 100%;
    display: grid;
    margin: 0;
    font-family: 'M PLUS 1p', sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  p {
    width: 100%;
    text-align: center;
    margin: auto;
  }

  p img {
    border-radius: 50%;
  }

  h1 {
    width: 100%;
    text-align: center;
    font-size: 48px;
    margin: auto;
  }

  h2 {
    width: 100%;
    background: black;
    color: white;
    padding: 0.25em 1em 0.25em 0.25em;
    text-align: right;
    font-size: 24px;
    margin: auto;
  }
`;

export type TemplateProps = {
  title: string;
  info: string;
};

export const Template = (props: TemplateProps) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <style dangerouslySetInnerHTML={{__html: style}} />
    </head>
    <body>
      <p><img width={200} height={200} src={`data:image/png;base64,${icon}`} /></p>
      <h1>{props.title}</h1>
      <h2>{props.info}</h2>
    </body>
  </html>
);

export const render = (props: TemplateProps): string => {
  const markup = ReactDOM.renderToStaticMarkup(<Template {...props} />);
  const html = `<!doctype html>${markup}`;
  return html;
};
