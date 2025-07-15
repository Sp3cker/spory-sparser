import test from "ava";
import { parseScriptedEvents } from "../../parseMaps/incParser.ts";

test("parseScriptedEvents should extract giveitem commands", (t) => {
  const content = `
  script::
  @explanation This is a test
    giveitem ITEM_POTION, 5
    giveitem ITEM_POKEBALL
  end
    `;

  const scriptEvent = parseScriptedEvents(content);
  t.is(scriptEvent.length, 1);
  t.is(scriptEvent[0].items.length, 2);
  t.deepEqual(scriptEvent[0].items[0], { name: "ITEM_POTION", quantity: 5 });
  t.deepEqual(scriptEvent[0].items[1], { name: "ITEM_POKEBALL", quantity: 1 });
  t.deepEqual(scriptEvent[0].explanation, "This is a test");
  t.deepEqual(scriptEvent[0].scriptName, "script::");
});
test("it should not parse ill-cased keywords like `giveItemFast`", (t) => {
  const content = `
  test_script::
  @explanation This is a failing test
    giveItemFast ITEM_POTION, 5
  end
    `;
  const scriptEvent = parseScriptedEvents(content);
  t.is(scriptEvent.length, 1);
  t.is(scriptEvent[0].items.length, 0); // No items should be parsed
});
test("Don't find script if :: is anywhere BUT end of line", (t) => {
  const content = `
  script::test_script
  @explanation This is a test
    giveitem ITEM_POTION, 5
  end
    `;
  const scriptEvent = parseScriptedEvents(content);
  t.is(scriptEvent.length, 0);
});
test("pop first bit of script name before first underscore", (t) => {
  const content = `
  test_script::
  @explanation This is a test
    giveitem ITEM_POTION, 5
  end
    `;
  const scriptEvent = parseScriptedEvents(content);
  t.is(scriptEvent.length, 1);
  t.is(scriptEvent[0].scriptName, "script::");
});
test("all the ways to detect items", (t) => {
  const content = `
  this_script::
  @explanation This is a test
    giveitem ITEM_REPEL, 2
	  dynmultipush UnusedText, ITEM_RED_SHARD
    giveitemfast ITEM_POKEBALL, 4
  end
    `;
  const scriptEvent = parseScriptedEvents(content);

  t.is(scriptEvent.length, 1);
  t.is(scriptEvent[0].items.length, 3);
  t.deepEqual(scriptEvent[0].items[0], { name: "ITEM_REPEL", quantity: 2 });
  t.deepEqual(scriptEvent[0].items[1], { name: "ITEM_RED_SHARD", quantity: 1 });
  t.deepEqual(scriptEvent[0].items[2], { name: "ITEM_POKEBALL", quantity: 4 });
});
