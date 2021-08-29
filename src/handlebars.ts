// @ts-nocheck
// This is needed because ts doesn't allow the use of this within a function block.
// Maybe there is a better way to solve this. I am not aware of it.

import handlebars, { HelperDeclareSpec } from "handlebars";

const H = handlebars.create();
H.registerHelper("slug", slug);

H.registerHelper("strip", function (options) {
  let str = options.fn(this);
  str = str.trim();
  str = str.replaceAll("\n", "");
  str = str.replaceAll("  ", "");
  console.log("Hello");
  return new handlebars.SafeString(str);
});

H.registerHelper("filterModifiers", function (check, blacklist) {
  let blacklistArray = blacklist.split(",");
  blacklistArray = blacklistArray.map((item) => item.trim());
  // check array of modifiers if match with the blocked ones
  let checkArray = check.map((item) => item.modifierName.name);

  console.log(`Blacklist: `);
  console.log(blacklistArray);
  console.log(`To check: ${checkArray}`);

  if (checkArray.length == 0) {
    console.log(`Result true`);
    return true;
  }

  let notHere = true;

  for (let i = 0; i < checkArray.length; i++) {
    if (blacklistArray.indexOf(checkArray[i]) > -1) {
      notHere = false;
      break;
    }
  }

  console.log(`Result ${notHere}`);
  return notHere;
});

H.registerHelper({
  eq: function (v1, v2) {
    return v1 === v2;
  },
  ne: function (v1, v2) {
    return v1 !== v2;
  },
  lt: function (v1, v2) {
    return v1 < v2;
  },
  gt: function (v1, v2) {
    return v1 > v2;
  },
  lte: function (v1, v2) {
    return v1 <= v2;
  },
  gte: function (v1, v2) {
    return v1 >= v2;
  },
  and: function () {
    return [...arguments].slice(0, -1).every(Boolean);
  },
  or: function () {
    return [...arguments].slice(0, -1).some(Boolean);
  },
});

export type Template<Context> = (context: Context) => string;

export function registerHelpers(helpers: HelperDeclareSpec) {
  H.registerHelper(helpers);
}

export function compile(template: string): Template<unknown> {
  const compiledTemplate = H.compile(template, { noEscape: true });
  return (context) =>
    compiledTemplate(context, {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    });
}

export function slug(str: string): string {
  return str.replace(/\W/g, "-");
}
