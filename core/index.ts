import { Idl } from "@project-serum/anchor";
import { AnchorTypes } from "./mappings";
import fs from "fs";
import pluralize from "pluralize";
let idlSchema = {
  accounts: JSON.parse(fs.readFileSync("./idl.json", "utf8")).accounts,
  types: JSON.parse(fs.readFileSync("./idl.json", "utf8")).types,
} as Idl;
console.log(idlSchema);
let currentPrismaSchema = fs.readFileSync("./prisma/schema.prisma", "utf8");

const capitalize = (s: string) => (s && s[0].toUpperCase() + s.slice(1)) || "";
Object.keys(idlSchema).map((key) => {
  if (!idlSchema.accounts && !idlSchema.types) return;
  let prismaschema = "";

  // idlSchema.accounts &&
  //   idlSchema.accounts.map((a) => {
  //     manyToManyModel.title += `${capitalize(a.name)}`;
  //   });
  // manyToManyModel.title += `Id`;
  // console.log("hith", manyToManyModel);
  try {
    if (key === "accounts") {
      let manyToManyModel: {
        title: string;
        schema: string;
        accs: string[];
        ids: string[];
      } = {
        title: "",
        schema: ``,
        accs: [],
        ids: [],
      };
      let modelRegistry: string[] = [];
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
              console.log(f);
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
                    // if (!manyToManyModel.accs.includes(f.name))

                    if (!manyToManyModel.accs.includes(type.name)) {
                      manyToManyModel.title += `${pluralize(
                        capitalize(type.name)
                      )}On`;
                      //@ts-ignore
                      let relationalModel = idlSchema.types?.find(
                        (
                          t //@ts-ignore
                        ) => t.name === f.type.defined && t.type.kind !== "enum"
                      );
                      if (relationalModel)
                        manyToManyModel.title += `${capitalize(
                          relationalModel?.name
                        )}On`;

                      manyToManyModel.schema += `${type.name} ${type.name} @relation(fields:[${type.name}Id],references:[pubkey]) \n ${type.name}Id String \n`; //@ts-ignore
                      manyToManyModel.schema += `${f.name} ${typefield} @relation(fields:[${f.name}Id],references:[${f.type.defined}Id]) \n ${f.name}Id String \n`;
                      manyToManyModel.accs = [
                        ...manyToManyModel.accs,
                        type.name,
                      ];
                      field += pluralize(f.name).concat(
                        ` ${replastchar(manyToManyModel.title)}[] \n` // ${f.name}Id String
                      );
                      manyToManyModel.ids = [`${type.name}Id`, `${f.name}Id`];
                    }
                  } else {
                    field += f.name.concat(` ${typefield}[]`);
                  }
                  console.log(field, "field", manyToManyModel);
                } else if (Object.keys(f.type).includes("defined")) {
                  let typefield: AnchorTypes | string =
                    typeof f.type == "string"
                      ? AnchorTypes.string //@ts-ignore
                      : f.type.defined; //@ts-ignore
                  if (f.type.defined) {
                    console.log(
                      "condition",
                      idlSchema.types?.find(
                        (
                          t //@ts-ignore
                        ) => t.name === f.type.defined && t.type.kind === "enum"
                      )
                    );

                    // field += pluralize(f.name).concat(
                    //   ` ${typefield}[] \n` // ${f.name}Id String
                    // );
                    // if (
                    //   !idlSchema.types?.find(
                    //     (
                    //       t //@ts-ignore
                    //     ) => t.name === f.type.defined && t.type.kind === "enum"
                    //   )
                    // ) {
                    console.log("h4", type.name);
                    if (!manyToManyModel.accs.includes(type.name)) {
                      manyToManyModel.title += `${pluralize(
                        capitalize(type.name)
                      )}On`;
                      //@ts-ignore
                      let relationalModel = idlSchema.types?.find(
                        (
                          t //@ts-ignore
                        ) => t.name === f.type.defined && t.type.kind !== "enum"
                      );
                      if (relationalModel)
                        manyToManyModel.title += `${capitalize(
                          relationalModel?.name
                        )}On`;

                      manyToManyModel.schema += `${type.name} ${type.name} @relation(fields:[${type.name}Id],references:[pubkey]) \n ${type.name}Id String \n`; //@ts-ignore
                      manyToManyModel.schema += `${f.name} ${typefield} @relation(fields:[${f.name}Id],references:[${f.type.defined}Id]) \n ${f.name}Id String \n`;
                      manyToManyModel.accs = [
                        ...manyToManyModel.accs,
                        type.name,
                      ];
                      field += pluralize(f.name).concat(
                        ` ${replastchar(manyToManyModel.title)}[] \n` // ${f.name}Id String
                      );
                      manyToManyModel.ids = [`${type.name}Id`, `${f.name}Id`];
                    }
                    // }
                    // console.log(manyToManyModel, "after", f.name);
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
        function replastchar(str: string) {
          var pos = str.lastIndexOf("On");
          str = str.substring(0, pos) + str.substring(pos + 2);
          return str;
        }
        console.log(
          `model ${replastchar(manyToManyModel.title)} { \n ${
            manyToManyModel.schema
          } }`
        );
        if (manyToManyModel.title) {
          if (data)
            if (!modelRegistry.includes(replastchar(manyToManyModel.title))) {
              prismaschema += data.concat(
                `model ${replastchar(manyToManyModel.title)} { \n ${
                  manyToManyModel.schema
                } \n @@id([${manyToManyModel.ids[0]},${
                  manyToManyModel.ids[1]
                }]) \n }`
              );
              console.log("here", manyToManyModel);
              modelRegistry.push(replastchar(manyToManyModel.title));
            }
        } else {
          if (data) prismaschema += data;
        }
      }
    } else if (key === "types") {
      let manyToManyModel: {
        title: string;
        schema: string;
        accs: string[];
        ids: string[];
      } = {
        title: "",
        schema: ``,
        accs: [],
        ids: [],
      };
      let modelRegistry: string[] = [];
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
                    // field += f.name.concat(
                    //   ` ${typefield}[] \n ${f.name}Id String`
                    // );
                    // console.log("this", field);
                    if (!manyToManyModel.accs.includes(type.name)) {
                      manyToManyModel.title += `${pluralize(
                        capitalize(type.name)
                      )}On`;
                      //@ts-ignore
                      let relationalModel = idlSchema.types?.find(
                        (
                          t //@ts-ignore
                        ) => t.name === f.type.defined && t.type.kind !== "enum"
                      );
                      if (relationalModel)
                        manyToManyModel.title += `${capitalize(
                          relationalModel?.name
                        )}On`;

                      manyToManyModel.schema += `${type.name} ${type.name} @relation(fields:[${type.name}Id],references:[pubkey]) \n ${type.name}Id String \n`; //@ts-ignore
                      manyToManyModel.schema += `${f.name} ${typefield} @relation(fields:[${f.name}Id],references:[${f.type.defined}Id]) \n ${f.name}Id String \n`;
                      manyToManyModel.accs = [
                        ...manyToManyModel.accs,
                        type.name,
                      ];
                      field += pluralize(f.name).concat(
                        ` ${replastchar(manyToManyModel.title)}[] \n` // ${f.name}Id String
                      );
                      manyToManyModel.ids = [`${type.name}Id`, `${f.name}Id`];
                    }
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
                    // field += f.name.concat(
                    //   ` ${typefield} \n ${f.name}Id String`
                    // );
                    if (!manyToManyModel.accs.includes(type.name)) {
                      manyToManyModel.title += `${pluralize(
                        capitalize(type.name)
                      )}On`;
                      //@ts-ignore
                      let relationalModel = idlSchema.types?.find(
                        (
                          t //@ts-ignore
                        ) => t.name === f.type.defined && t.type.kind !== "enum"
                      );
                      if (relationalModel)
                        manyToManyModel.title += `${capitalize(
                          relationalModel?.name
                        )}On`;

                      manyToManyModel.schema += `${type.name} ${type.name} @relation(fields:[${type.name}Id],references:[pubkey]) \n ${type.name}Id String \n`; //@ts-ignore
                      manyToManyModel.schema += `${f.name} ${typefield} @relation(fields:[${f.name}Id],references:[${f.type.defined}Id]) \n ${f.name}Id String \n`;
                      manyToManyModel.accs = [
                        ...manyToManyModel.accs,
                        type.name,
                      ];
                      field += pluralize(f.name).concat(
                        ` ${replastchar(manyToManyModel.title)}[] \n` // ${f.name}Id String
                      );
                      manyToManyModel.ids = [`${type.name}Id`, `${f.name}Id`];
                    }
                  } else {
                    field += f.name.concat(` ${typefield}`);
                  }
                } else {
                  // console.log(
                  //   "ola",
                  //   AnchorTypes[String(f.type) as keyof typeof AnchorTypes],
                  //   f.type
                  // );
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
        function replastchar(str: string) {
          var pos = str.lastIndexOf("On");
          str = str.substring(0, pos) + str.substring(pos + 2);
          return str;
        }
        if (manyToManyModel.title) {
          if (data)
            if (!modelRegistry.includes(replastchar(manyToManyModel.title))) {
              prismaschema += data.concat(
                `model ${replastchar(manyToManyModel.title)} { \n ${
                  manyToManyModel.schema
                } \n @@id([${manyToManyModel.ids[0]},${
                  manyToManyModel.ids[1]
                }]) \n }`
              );
              console.log("here", manyToManyModel);
              modelRegistry.push(replastchar(manyToManyModel.title));
            }
        } else {
          if (data) prismaschema += data;
        }
      }
    }
  } finally {
    // console.log(prismaschema, "prismaschema");
    // let finalSchema = currentPrismaSchema.concat(`\n ${prismaschema}`);
    fs.appendFileSync("./prisma/schema.prisma", prismaschema);
  }
});
