import { TextAlignProperty } from "../../../node_modules/csstype";
import { Color } from "./color";
import { Font } from "./font";

export class Style {
  // @todo make this an enum
  public textAlignment?: TextAlignProperty;
  // @return [Color, NilClass]
  public fillColor?: Color;
  // @return [Color, NilClass]
  public lineColor?: Color;
  // @todo move this to font
  // @return [Color, NilClass]
  public fontColor?: Color;
  // @return [Int, NilClass]
  public lineWidth?: number;
  // @return [Font, NilClass]
  public font?: Font;
  // @todo make this an enum
  public textPosition?: number;

  // TODO:
  // public toString() {
  //   const attr_name_vals = %i[textAlignment fillColor lineColor fontColor lineWidth
  //                       font textPosition].map { |k| "#{k}: #{send(k)}" }.join(", ")
  //   "Style(#{attr_name_vals})"
  // }

  // public text_align() {
  //   case textAlignment
  //   when "1"
  //     "left"
  //   when "2"
  //     "center"
  //   when "3"
  //     "right"
  //   }
  // }
}
