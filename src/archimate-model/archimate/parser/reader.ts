import { UnsupportedFormat } from "../interfaces";
import { ArchiFileReader } from "./archi/archi-file-reader";

export type IUnsupportedFormat = {
  xmlns?: string;
};

export function parse(doc: XMLDocument) {
  const nsAttr = doc.children[0].attributes.getNamedItem("xmlns");
  const ns = nsAttr ? (nsAttr as Attr).value : undefined;
  let model;
  switch (ns) {
    case "http://www.opengroup.org/xsd/archimate/3.0/":
    case "http://www.opengroup.org/xsd/archimate":
      throw new UnsupportedFormat("Format not supported", ns);
    default:
      model = new ArchiFileReader().parse(doc);
  }
  return model;
}
