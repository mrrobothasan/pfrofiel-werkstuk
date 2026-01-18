{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs
  ];
  previews = [
    {
      command = "npx http-server -p $PORT -c-1";
      manager = "web";
    }
  ];
}