/* =================== USAGE ===================

    import conf from "@cnwangjie/conf";
    conf().load("config.json");

 =============================================== */

declare function Conf(): Conf.Config

declare namespace Conf {
  interface ArgsOption {
    transform?: boolean
    args?: Array<string>
  }
  interface EnvOption {
    transform?: boolean
    split?: boolean
    tolower?: boolean
  }
  interface Config {
    (path: string): any
    get(path: string): any
    set(path: string, value: any): void
    load(path: string): this
    load(path: string, resolver: Function): this
    args(opt: ArgsOption): this
    env(opt: EnvOption): this
    separator: string // default '.'
  }
}

export = Conf
