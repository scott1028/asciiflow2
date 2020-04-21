import React = require("react");
import {
  AppBar,
  FormControlLabel,
  Switch,
  Toolbar as MaterialToolbar,
  Box,
} from "@material-ui/core";
import { Controller } from "asciiflow/client/controller";
import { Options } from "asciiflow/client/options";
import { CanvasStore } from "asciiflow/client/canvas_store";
import { useState } from "react";
import { useObserver } from "mobx-react";
import { store } from "asciiflow/client/store";
import { IDrawFunction } from "asciiflow/client/draw/function";
import { DrawLine } from "asciiflow/client/draw/line";
import { DrawBox } from "asciiflow/client/draw/box";
import { DrawFreeform } from "asciiflow/client/draw/freeform";
import { DrawErase } from "asciiflow/client/draw/erase";
import { DrawMove } from "asciiflow/client/draw/move";
import { DrawText } from "asciiflow/client/draw/text";
import { DrawSelect } from "asciiflow/client/draw/select";

const TOOLS: {
  [key: string]: { title: string; functionProvider: () => IDrawFunction };
} = {
  box: { title: "Draw boxes", functionProvider: () => new DrawBox() },
  line: {
    title: "Draw connecting lines",
    functionProvider: () => new DrawLine(false),
  },
  arrow: { title: "Draw arrows", functionProvider: () => new DrawLine(true) },
  freeform: {
    title: "Freeform drawing",
    functionProvider: () => new DrawFreeform("X"),
  },
  erase: {
    title: "Erase square areas",
    functionProvider: () => new DrawErase(),
  },
  move: {
    title: "Resize/move boxes and lines",
    functionProvider: () => new DrawMove(),
  },
  text: { title: "Text tool", functionProvider: () => new DrawText() },
  select: {
    title: "Select, copy, cut and move",
    functionProvider: () => new DrawSelect(),
  },
};

// handleFileButton(id: string) {
//   $(".dialog").removeClass("visible");
//   $("#" + id + "-dialog").toggleClass("visible");

//   if (id == "import-button") {
//     $("#import-area").val("");
//     $("#import-area").focus();
//   }

//   if (id == "export-button") {
//     $("#export-area").val(this.state.outputText());
//     $("#export-area").select();
//   }
//   if (id == "clear-button") {
//     this.state.clear();
//   }
//   if (id == "undo-button") {
//     this.state.undo();
//   }
//   if (id == "redo-button") {
//     this.state.redo();
//   }
// }

// $("#draw-tools > button.tool").click((e) => {
//   $("#text-tool-widget").hide(0);
//   this.handleDrawButton(e.target.id);
// });

// $("#file-tools > button.tool").click((e) => {
//   this.handleFileButton(e.target.id);
// });

// $("button.close-dialog-button").click((e) => {
//   $(".dialog").removeClass("visible");
// });

// $("#import-submit-button").click((e) => {
//   this.state.clear();
//   this.state.fromText(
//     /** @type {string} */
//     String($("#import-area").val()),
//     this.view.screenToCell(
//       new Vector(this.view.canvas.width / 2, this.view.canvas.height / 2)
//     )
//   );
//   this.state.commitDraw();
//   $("#import-area").val("");
//   $(".dialog").removeClass("visible");
// });

// // Bit of a hack, just triggers the text tool to get a new value.
// $("#text-tool-input, #freeform-tool-input").keyup(() => {
//   this.drawFunction.handleKey("");
// });
// $("#text-tool-input, #freeform-tool-input").change(() => {
//   this.drawFunction.handleKey("");
// });
// $("#text-tool-close").click(() => {
//   $("#text-tool-widget").hide();
//   this.state.commitDraw();
// });

export const Toolbar = () => {
  const [currentTool, setCurrentTool] = useState("box");
  return useObserver(() => (
    <AppBar position="fixed">
      <MaterialToolbar variant="dense" className={"toolbar"}>
        <img
          id="logo-bar"
          src="public/images/logo-bar.gif"
          width="88"
          height="24"
        />

        <FormControlLabel
          control={
            <Switch
              checked={store.unicode.get()}
              onChange={(e) => store.setUnicode(e.target.checked)}
            />
          }
          label="Unicode"
        />

        <div id="draw-tools">
          {Object.keys(TOOLS).map((tool) => (
            <button
              key={tool}
              id={`${tool}-button`}
              className={`tool ${
                currentTool === tool ? "active" : ""
              } ${tool}-image`}
              title={TOOLS[tool].title}
              onClick={() => {
                setCurrentTool(tool);
                store.setDrawFunction(TOOLS[tool].functionProvider());
              }}
            />
          ))}
        </div>

        <div id="file-tools">
          <button
            id="export-button"
            className="tool export-image"
            title="Export"
          />
          <button
            id="import-button"
            className="tool import-image"
            title="Import"
          />
          <button
            id="clear-button"
            className="tool clear-image"
            title="Clear"
          />
          <button id="undo-button" className="tool undo-image" title="Undo" />
          <button id="redo-button" className="tool redo-image" title="Redo" />
          <Options />
        </div>

        <div id="export-button-dialog" className="dialog">
          <textarea id="export-area" />
          <div className="dialog-button-bar">
            <button className="close-dialog-button">Close</button>
          </div>
        </div>

        <div id="import-button-dialog" className="dialog">
          <textarea id="import-area" />
          <div className="dialog-button-bar">
            <button className="close-dialog-button">Close</button>
            <button id="import-submit-button">Import</button>
          </div>
        </div>
      </MaterialToolbar>
    </AppBar>
  ));
};
