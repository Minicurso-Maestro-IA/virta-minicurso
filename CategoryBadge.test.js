import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { createJiti } from "jiti";

globalThis.React = React;
const jiti = createJiti(import.meta.url, { jsx: true });
const { CategoryBadge } = await jiti.import("./src/components/CategoryBadge.tsx");

test("1. Categoria 'Moradia' com cor '#8b5cf6' aplica estilos e conteúdo corretos", () => {
  const result = CategoryBadge({ name: "Moradia", color: "#8b5cf6" });
  assert.ok(result, "Elemento deve ser retornado");
  assert.equal(result.type, "span");
  assert.equal(result.props.style.backgroundColor, "#8b5cf61a");
  assert.equal(result.props.style.color, "#8b5cf6");

  const [dot, text] = result.props.children;
  assert.equal(text, "Moradia");
  assert.equal(dot.type, "span");
  assert.ok(
    dot.props.style.backgroundColor === "#8b5cf6" || dot.props.style.background === "#8b5cf6",
    "Indicador circular deve ter cor #8b5cf6"
  );
});

test("2. Categoria 'Mercado' com cor '#f97316' aplica estilos e conteúdo corretos", () => {
  const result = CategoryBadge({ name: "Mercado", color: "#f97316" });
  assert.ok(result, "Elemento deve ser retornado");
  assert.equal(result.type, "span");
  assert.equal(result.props.style.backgroundColor, "#f973161a");
  assert.equal(result.props.style.color, "#f97316");

  const [dot, text] = result.props.children;
  assert.equal(text, "Mercado");
  assert.equal(dot.type, "span");
  assert.ok(
    dot.props.style.backgroundColor === "#f97316" || dot.props.style.background === "#f97316",
    "Indicador circular deve ter cor #f97316"
  );
});

test("3. Cor nula ou indefinida utiliza a cor padrão #71717a", () => {
  const resultNull = CategoryBadge({ name: "Geral", color: null });
  assert.ok(resultNull, "Elemento com color=null deve ser retornado");
  assert.equal(resultNull.props.style.backgroundColor, "#71717a1a");
  assert.equal(resultNull.props.style.color, "#71717a");
  const [dotNull, textNull] = resultNull.props.children;
  assert.equal(textNull, "Geral");
  assert.ok(
    dotNull.props.style.backgroundColor === "#71717a" || dotNull.props.style.background === "#71717a",
    "Indicador deve ter cor padrão #71717a"
  );

  const resultUndefined = CategoryBadge({ name: "Geral", color: undefined });
  assert.ok(resultUndefined, "Elemento com color=undefined deve ser retornado");
  assert.equal(resultUndefined.props.style.backgroundColor, "#71717a1a");
  assert.equal(resultUndefined.props.style.color, "#71717a");

  const resultEmptyColor = CategoryBadge({ name: "Geral", color: "" });
  assert.ok(resultEmptyColor, "Elemento com color='' deve ser retornado com fallback padrão");
  assert.equal(resultEmptyColor.props.style.backgroundColor, "#71717a1a");
  assert.equal(resultEmptyColor.props.style.color, "#71717a");
});

test("4. Name vazio, nulo, indefinido ou preenchido com espaços retorna null", () => {
  assert.equal(CategoryBadge({ name: "", color: "#8b5cf6" }), null);
  assert.equal(CategoryBadge({ name: "   ", color: "#8b5cf6" }), null);
  assert.equal(CategoryBadge({ name: null, color: "#8b5cf6" }), null);
  assert.equal(CategoryBadge({ name: undefined, color: "#8b5cf6" }), null);
  assert.equal(CategoryBadge({}), null);
});

test("5. Transação sem categoria ('Passagens') não exibe badge visual (retorna null)", () => {
  const transacaoPassagens = {
    description: "Passagens",
    categoryName: null,
    categoryColor: null,
  };
  const result = CategoryBadge({
    name: transacaoPassagens.categoryName,
    color: transacaoPassagens.categoryColor,
  });
  assert.equal(result, null, "Badge deve retornar null para transação sem categoria");
});
