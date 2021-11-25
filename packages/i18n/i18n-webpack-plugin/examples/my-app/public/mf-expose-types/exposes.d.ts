// module name: my_app/shared-utils

declare module 'my_app/shared-utils' {
    /**
     * 说 hello
     *
     * @author yuzhanglong
     * @date 2021-11-24 12:05:36
     */
    export const add: (a: number, b: number) => number;
    export const sayHello: () => void;
    export default add;
    export { };
}

