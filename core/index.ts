import { Idl } from "@project-serum/anchor";
import { AnchorTypes } from "./mappings";
import fs from "fs";

let idlSchema = {
  accounts: JSON.parse(fs.readFileSync("./idl.json", "utf8")).accounts,
  types: JSON.parse(fs.readFileSync("./idl.json", "utf8")).types,
} as Idl;
console.log(idlSchema);
let currentPrismaSchema = fs.readFileSync("./prisma/schema.prisma", "utf8");

console.log("blah");
Object.keys(idlSchema).map((key) => {
  let prismaschema = "";
  try {
    if (key === "accounts") {
      const types = idlSchema.accounts;
      for (let i in types) {
        let data;
        const type = types[Number(i)];
        // console.log(type.name.includes("Input"), type.name);
        if (type.name.toLowerCase().includes("input")) continue; // just for custom input structs
        //@ts-ignore
        if (type.type.kind === "enum") {
          data = `
      enum ${type.name}{
          ${
            //@ts-ignore
            type?.type?.variants?.map((v) => v.name).join("\n")
          }
          }
      `;
        } else if (type.type.kind === "struct") {
          data = `
      model ${type.name}{
          ${type?.type?.fields
            ?.map((f, i: number) => {
              // console.log(f.type);
              let field = "";
              if (i === 0) {
                field = "pubkey String @id \n";
              }
              try {
                if (Object.keys(f.type).includes("vec")) {
                  let typefield: AnchorTypes | string =
                    typeof f.type == "string"
                      ? AnchorTypes.string //@ts-ignore
                      : typeof f.type.vec === "string"
                      ? AnchorTypes.string //@ts-ignore
                      : f.type.vec.defined; //@ts-ignore
                  if (f.type.vec.defined) {
                    field += f.name.concat(
                      ` ${typefield}[] \n ${f.name}Id String`
                    );
                  } else {
                    field += f.name.concat(` ${typefield}[]`);
                  }
                  // console.log(field, "field");
                } else if (Object.keys(f.type).includes("defined")) {
                  let typefield: AnchorTypes | string =
                    typeof f.type == "string"
                      ? AnchorTypes.string //@ts-ignore
                      : f.type.defined; //@ts-ignore
                  if (f.type.defined) {
                    console.log(f.name, "fname");
                    field += f.name.concat(
                      ` ${typefield} \n ${f.name}Id String`
                    );
                    // console.log("this", field);
                  } else {
                    field += f.name.concat(` ${typefield}`);
                  }
                } else {
                  console.log(f.type, ".ftype");
                  let typefield: AnchorTypes | string = ``; //@ts-ignore
                  if (f.type.option) {
                    //@ts-ignore
                    if (f.type.option.defined) {
                      //@ts-ignore
                      console.log(f.type.option.defined, f.name, "fname2"); //@ts-ignore
                      typefield = ` ${f.type.option.defined} \n ${f.name}Id String`;
                    } else {
                      //@ts-ignore
                      typefield = `${
                        AnchorTypes[ //@ts-ignore
                          String(f.type.option) as keyof typeof AnchorTypes
                        ]
                      }?`; //@ts-ignore
                    } //@ts-ignore
                  } else if (f.type.array) {
                    typefield = `${
                      //@ts-ignore
                      AnchorTypes[ //@ts-ignore
                        String(f.type.array[0]) as keyof typeof AnchorTypes
                      ]
                    }[]`;
                  } else {
                    typefield =
                      AnchorTypes[String(f.type) as keyof typeof AnchorTypes]; //@ts-ignore
                  }
                  field += f.name.concat(` ${typefield}`);
                }
              } finally {
                // console.log("f2", field);
                return field;
              }
            })
            .join("\n")}
      }
      `;
        }

        if (data) prismaschema += data;
      }
    } else if (key === "types") {
      const types = idlSchema.types;
      for (let i in types) {
        let data;
        const type = types[Number(i)];
        // console.log(type.name.includes("Input"), type.name);
        if (type.name.toLowerCase().includes("input")) continue; // just for custom input structs
        if (type.type.kind === "enum") {
          data = `
      enum ${type.name}{
          ${
            //@ts-ignore
            type?.type?.variants?.map((v) => v.name).join("\n")
          }
          }
      `;
        } else if (type.type.kind === "struct") {
          data = `
      model ${type.name}{
          ${type?.type?.fields
            ?.map((f, i: number) => {
              // console.log(f.type);
              let field = "";
              if (i === 0) {
                field = `${type.name}Id String @id @default(uuid()) \n`;
              }
              try {
                if (Object.keys(f.type).includes("vec")) {
                  let typefield: AnchorTypes | string =
                    typeof f.type == "string"
                      ? AnchorTypes.string // @ts-ignore
                      : typeof f.type.vec === "string"
                      ? AnchorTypes.string // @ts-ignore
                      : f.type.vec.defined; // @ts-ignore
                  if (f.type.vec.defined) {
                    field += f.name.concat(
                      ` ${typefield}[] \n ${f.name}Id String`
                    );
                    // console.log("this", field);
                  } else {
                    field += f.name.concat(` ${typefield}[]`);
                  }
                  // console.log(field, "field");
                } else if (Object.keys(f.type).includes("defined")) {
                  let typefield: AnchorTypes | string =
                    typeof f.type == "string"
                      ? AnchorTypes.string // @ts-ignore
                      : f.type.defined; // @ts-ignore
                  if (f.type.defined) {
                    field += f.name.concat(
                      ` ${typefield} \n ${f.name}Id String`
                    );
                  } else {
                    field += f.name.concat(` ${typefield}`);
                  }
                } else {
                  console.log(
                    "ola",
                    AnchorTypes[String(f.type) as keyof typeof AnchorTypes],
                    f.type
                  );
                  let typefield: AnchorTypes | string = ``; //@ts-ignore
                  if (f.type.option) {
                    //@ts-ignore
                    if (f.type.option.defined) {
                      //@ts-ignore
                      console.log(f.type.option.defined, "fname3"); //@ts-ignore
                      typefield = ` ${f.type.option.defined} \n ${f.name}Id String`;
                    } else {
                      //@ts-ignore
                      typefield = `${
                        AnchorTypes[ //@ts-ignore
                          String(f.type.option) as keyof typeof AnchorTypes
                        ]
                      }?`; //@ts-ignore
                    } //@ts-ignore
                  } else if (f.type.array) {
                    typefield = `${
                      //@ts-ignore
                      AnchorTypes[ //@ts-ignore
                        String(f.type.array[0]) as keyof typeof AnchorTypes
                      ]
                    }[]`;
                  } else {
                    typefield =
                      AnchorTypes[String(f.type) as keyof typeof AnchorTypes]; //@ts-ignore
                  }
                  field += f.name.concat(` ${typefield}`);
                }
              } finally {
                return field;
              }
            })
            .join("\n")}
      }
      `;
        }

        if (data) prismaschema += data;
      }
    }
  } finally {
    fs.appendFileSync("./prisma/schema.prisma", prismaschema);
  }
});
