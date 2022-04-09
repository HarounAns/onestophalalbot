const axios = require("axios");
const HTMLParser = require("node-html-parser");

const url = "https://onestophalal.com/products";
const delimeter = " - ";

const products = [
  "full-blood-wagyu-burger-patties",
  "full-blood-wagyu-sampler-set",
  "full-blood-wagyu-new-york-strip-steak",
  "full-blood-wagyu-ribeye-steak",
  "full-blood-wagyu-tomahawk-steak",
  "full-blood-wagyu-t-bone-steak",
  "full-blood-wagyu-porterhouse-steak",
  "full-blood-wagyu-filet-mignon",
  "full-blood-wagyu-brisket",
  "full-blood-wagyu-short-ribs-block",
  "full-blood-wagyu-short-ribs-single",
  "full-blood-wagyu-picanha-steak",
  "full-blood-wagyu-tri-tip-steak",
  "full-blood-wagyu-korean-flanken-ribs",
  "full-blood-wagyu-denver-steak",
  "full-blood-wagyu-flat-iron-steak",
  "full-blood-wagyu-rib-cap",
  "full-blood-wagyu-top-sirloin-steak",
  "full-blood-wagyu-eye-of-round-steak",
  "full-blood-wagyu-kababs",
  "full-blood-wagyu-taco-meat",
  "full-blood-wagyu-ranchera-carne-asada",
  "full-blood-wagyu-flank-steak",
  "full-blood-wagyu-filet-mignon-medallions",
  "full-blood-wagyu-bottom-round-steak",
  "full-blood-wagyu-top-round-steak",
  "full-blood-wagyu-peeled-knuckle-sirloin-tip",
  "full-blood-wagyu-chuck-steak",
  "full-blood-wagyu-top-blade-steak",
  "full-blood-wagyu-chuck-tender",
  "full-blood-wagyu-inside-skirt-steak",
  "full-blood-wagyu-boneless-shank-nihari",
];
const items = {};

const fetchProductData = async (product) => {
  try {
    items[product] = {};

    const { data } = await axios.get(`${url}/${product}`);
    const root = HTMLParser.parse(data);
    const productsVariants = root.querySelector(".product-variants");

    for (const cn of productsVariants.childNodes) {
      let option = cn.innerText.replace(/(\r\n|\n|\r)/gm, "").trim();
      if (!option) continue;

      const split = option.split(delimeter);

      // handle case where there are extra delimeters
      if (split.length > 2) {
        const key = [split[0], split[1]].join(delimeter);
        items[product][key] = split[2];
        continue;
      }

      const key = split[0] === "Default Title" ? "price" : split[0];
      items[product][key] = split[1];
    }
  } catch (error) {
    console.error(`Error with product ${product}`, error);
  }
};

module.exports.fetchWagyuItems = async () => {
  const promiseList = [];
  for (const product of products) {
    promiseList.push(fetchProductData(product));
  }

  await Promise.allSettled(promiseList);
  return items;
};
