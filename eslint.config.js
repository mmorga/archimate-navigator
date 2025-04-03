import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    settings: {
      react: {
        createClass: "createReactClass", // Regex for Component Factory to use,
        // default to "createReactClass"
        pragma: "React", // Pragma to use, default to "React"
        fragment: "Fragment", // Fragment to use (may be a property of <pragma>), default to "Fragment"
        version: "detect", // React version. "detect" automatically picks the version you have installed.
        // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
        // Defaults to the "defaultVersion" setting and warns if missing, and to "detect" in the future
        defaultVersion: "19", // Default React version to use when the version you have installed cannot be detected.
        // If not provided, defaults to the latest React version.
        flowVersion: "0.53", // Flow version
      },
      propWrapperFunctions: [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        "forbidExtraProps",
        { property: "freeze", object: "Object" },
        { property: "myFavoriteWrapper" },
        // for rules that check exact prop wrappers
        { property: "forbidExtraProps", exact: true },
      ],
      componentWrapperFunctions: [
        // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
        "observer", // `property`
        { property: "styled" }, // `object` is optional
        { property: "observer", object: "Mobx" },
        { property: "observer", object: "<pragma>" }, // sets `object` to whatever value `settings.react.pragma` is set to
      ],
      formComponents: [
        // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
        "CustomForm",
        { name: "SimpleForm", formAttribute: "endpoint" },
        { name: "Form", formAttribute: ["registerEndpoint", "loginEndpoint"] }, // allows specifying multiple properties if necessary
      ],
      linkComponents: [
        // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
        "Hyperlink",
        { name: "MyLink", linkAttribute: "to" },
        { name: "Link", linkAttribute: ["to", "href"] }, // allows specifying multiple properties if necessary
      ],
    },
  },
  // { files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  // {
  //   files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  //   languageOptions: { globals: globals.browser },
  // },
  // {
  //   files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  //   plugins: { eslint },
  //   extends: ["eslint/recommended"],
  // },
  // {
  //   files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  //   plugins: { tseslint },
  //   extends: ["tseslint/recommended"],
  // },
  {
    files: ["src/**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      eslint,
      reactHooks,
      tseslint,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    extends: [
      "eslint/recommended",
      "tseslint/recommended",
      "reactHooks/recommended-latest",
    ],
  },
  {
    files: ["src/**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "react/display-name": "off",
      "react/jsx-key": "error",
      "react/jsx-no-comment-textnodes": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-target-blank": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/no-children-prop": "error",
      "react/no-danger-with-children": "error",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-find-dom-node": "error",
      "react/no-is-mounted": "error",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-unescaped-entities": "error",
      "react/no-unknown-property": "error",
      "react/no-unsafe": "off",
      "react/prop-types": "error",
      "react/react-in-jsx-scope": "off",
      "react/require-render-return": "error",
    },
  },
  eslintConfigPrettier,
  {
    plugins: {
      "react-compiler": reactCompiler,
    },
    rules: {
      "react-compiler/react-compiler": "error",
    },
  },
]);
