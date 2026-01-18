{ pkgs, ... }: {
  packages = [
    pkgs.nodejs_18
  ];

  env = {
    NODE_ENV = "development";
  };
}