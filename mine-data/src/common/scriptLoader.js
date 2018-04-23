export function scriptLoader(src, async = false) {
  const script = document.createElement('script');

  script.type = 'text/javascript';
  script.src = src;
  script.async = async;

  return new Promise((fulfill, reject) => {
    script.onload = () => fulfill();
    script.onerror = error => reject(error);

    document.querySelector('head').appendChild(script);
  });
}
