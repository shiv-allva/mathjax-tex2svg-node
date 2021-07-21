import mathjax from "mathjax";
import fs from "fs";
import readline from "readline";

mathjax
  .init({
    loader: { load: ["input/tex-full", "output/svg"] },
    svg: {
      scale: 1, // global scaling factor for all expressions
      mtextInheritFont: false, // true to make mtext elements use surrounding font
      merrorInheritFont: true, // true to make merror text use surrounding font
      mathmlSpacing: false, // true for MathML spacing rules, false for TeX rules
      skipAttributes: {}, // RFDa and other attributes NOT to copy to the output
      exFactor: 0.5, // default size of ex in em units
      displayAlign: "center", // default for indentalign when set to 'auto'
      displayIndent: "0", // default for indentshift when set to 'auto'
      fontCache: "local", // or 'global' or 'none'
    },
  })
  .then(async (MathJax) => {
    try {
      fs.writeFile("./output.html", "", (err, success) => {
        if (err) return console.error(err);
      });
      const fileStream = fs.createReadStream("./greeksymbols.txt");
      const lines = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });
      for await (var line of lines) {
        if (line.substring(0, 1) == "#") continue;
        const svg = MathJax.tex2svg(line, {
          display: true,
        });
        // console.log(MathJax.startup.adaptor.outerHTML(svg));
        fs.appendFile(
          `./output.html`,
          MathJax.startup.adaptor.outerHTML(svg),
          (err, success) => {
            if (err) return console.log(err);
            console.log(`${line} - file saved`);
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  })
  .catch((err) => console.log(err.message));
