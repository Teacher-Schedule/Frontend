export class Rule {
  public static required = (value: string) =>
    !!value || "Это поле обязательно для заполнения";
}
