// @ts-check

import fs from "node:fs"
import path from "node:path"
import esbuild from "esbuild"
import EmbedCSSPlugin from "esbuild-plugin-css-in-js"
import ts from "typescript"
import { watch } from "chokidar"

// Clean 'dist' folder

const DIST_PATH = path.resolve("dist")
if (fs.existsSync(DIST_PATH)) {
  fs.rmSync(DIST_PATH, { recursive: true })
}

// Bundle

await build()
copyPackageJson()
copyReadme()

async function build(file) {
  const label = file ? `File ${getRelativePath(file)} changed` : ``

  file && console.time(label)

  await esbuild.build({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    bundle: true,
    sourcemap: false,
    minify: false,
    splitting: true,
    format: "esm",
    target: ["esnext"],
    external: ["vite", "react", "react-dom", "react-router-dom"],
    plugins: [EmbedCSSPlugin()],
  })
  buildDefinitions()

  file && console.timeEnd(label)
}

async function buildDefinitions() {
  const program = ts.createProgram({
    rootNames: ["src/index.ts"],
    options: {
      declaration: true,
      emitDeclarationOnly: true,
      jsx: ts.JsxEmit.React,
      outDir: "dist",
      esModuleInterop: true,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      isolatedModules: true,
      skipLibCheck: true,
      lib: ["esnext", "dom", "dom.iterable"],
      types: ["node", "vite/client"],
    },
  })
  const emitResult = program.emit()

  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start ?? 0
      )
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`)
    }
  })
}

function getRelativePath(file) {
  const root = path.resolve(".")
  const relativePath = file.replace(root, "").replace(/^\/?src\//, "/")
  return relativePath
}

// Copy & edit package.json

function copyPackageJson() {
  const packageSource = fs.readFileSync(path.resolve("package.json")).toString("utf-8")

  const packageJson = JSON.parse(packageSource)
  packageJson.scripts = {}
  packageJson.dependencies = {}
  packageJson.devDependencies = {}
  packageJson.type = "module"

  fs.writeFileSync(
    path.join(DIST_PATH, "package.json"),
    Buffer.from(JSON.stringify(packageJson, null, 2), "utf-8")
  )
}

function copyReadme() {
  const readme = fs.readFileSync(path.resolve("README.md")).toString("utf-8")

  fs.writeFileSync(path.join(DIST_PATH, "README.md"), Buffer.from(readme, "utf-8"))
}

// Watch in dev mode

const args = process.argv
if (!args.includes("-w")) process.exit(0)

console.log("Watching for file changes...")

const watcher = watch(path.resolve("src"), { persistent: true })
watcher.on("add", build).on("change", build).on("unlink", build)
