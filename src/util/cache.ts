import { readFileSync, writeFileSync } from "fs";
import path from "path";
import fs from "fs";

const cachePath = process.cwd() + "/src/log/cache.json";
type Cache = Record<
  string,
  {
    value: any;
    expiredDate: number;
  }
>;

export const ensureCacheFileExists = () => {
  const dir = path.dirname(cachePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(cachePath)) {
    fs.writeFileSync(cachePath, ""); 
  }
};


const save = async (key: string, value: any, ttl = 60 * 1000) => {
  try {
    const file = await readFileSync(cachePath, "utf8");
    let data: Cache = {};
    if (file) {
      data = JSON.parse(file);
    }
    data[key] = {
      value,
      expiredDate: Date.now() + ttl,
    };

    await writeFileSync(cachePath, JSON.stringify(data), {
      flag: "w",
    });
  } catch (error) {
    console.error(error);
  }
};

const get = async (key: string) => {
  try {
    const file = await readFileSync(cachePath, "utf8");
    if (!file) {
      return undefined;
    }
    const data = JSON.parse(file) as Cache;
    if (!data[key]) return undefined;

    if (data[key].expiredDate <= Date.now()) {
      delete data[key];
      return undefined;
    }
    return data[key].value;
  } catch (error) {
    return undefined;
  }
};

const cache = {
  save,
  get,
};

export default cache;