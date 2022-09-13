module.exports = [
  {
    name: "DDTech",
    url: "https://ddtech.mx/productos/componentes",
    logo: "https://ddtech.mx/assets/img/ddtech.png?1646781481",
    products: async ({ page }) => {
      const allProducts = []
      const allImages = []
      let continuar = true

      const mergeProducts = (products, images) => {
        return products.map((product, index) => {
          return {
            ...product,
            img: images[index].img,
          }
        })
      }

      while (continuar) {
        //Scroll to the bottom of the page
        await page.evaluate(function () {
          const scrollInterval = setInterval(() => {
            window.scrollBy(0, window.innerHeight)

            if (
              window.pageYOffset + window.innerHeight >=
              document.body.scrollHeight
            ) {
              clearInterval(scrollInterval)
            }
          }, 600)
        })
        await new Promise(resolve => {
          setTimeout(() => {
            resolve("resolved")
          }, 5000)
        })

        const products = await page.evaluate(() => {
          const products = []
          const images = []

          //Save the img src
          const imgs = document.querySelectorAll(".product-image img")
          imgs.forEach(img => {
            if (img.src === "https://ddtech.mx/assets/img/blank.gif")
              console.log("Image not found")
            images.push({
              img: img.src,
            })
          })

          document.querySelectorAll(".product").forEach(product => {
            const name = product.querySelector(".name").innerText
            const price = product.querySelector(".price").innerText
            const stock = product.querySelector(".with-stock") ? true : false
            products.push({ name, price, stock })
          })

          return [products, images]
        })

        allProducts.push(...products[0])
        allImages.push(...products[1])

        continuar = await page.evaluate(() => {
          if (!document.querySelector('a[rel="next"]')) return false
          return true
        })

        if (continuar) {
          await page.click("a:has-text('Siguiente')")
        } else return mergeProducts(allProducts, allImages)
      }
    },
  },
  {
    name: "xtremetecpc",
    url: "https://www.xtremetecpc.com/c/compo/",
    logo: "https://www.xtremetecpc.com/wp-content/uploads/2018/08/logo-2015.png",
    products: async ({ page }) => {
      const allProducts = []
      let continuar = true
      while (continuar) {
        //Scroll to the bottom of the page
        await page.evaluate(function () {
          const scrollInterval = setInterval(() => {
            window.scrollBy(0, window.innerHeight)

            if (
              window.pageYOffset + window.innerHeight >=
              document.body.scrollHeight
            ) {
              clearInterval(scrollInterval)
            }
          }, 500)
        })
        await new Promise(resolve => {
          setTimeout(() => {
            resolve("resolved")
          }, 4000)
        })

        const products = await page.evaluate(() => {
          const products = []
          document.querySelectorAll(".product-inner").forEach(product => {
            const name = product.querySelector(
              ".woocommerce-loop-product__title"
            ).innerText
            const price = product.querySelector(".price").innerText
            const stock = product.querySelector(".agotado") ? false : true
            const image = product.querySelector(
              ".product-thumbnail-wrapper img"
            ).src
            products.push({ name, price, stock, image })
          })
          return products
        })
        allProducts.push(...products)
        continuar = await page.evaluate(() => {
          if (!document.querySelector("a.next")) return false
          return true
        })
        if (continuar) {
          await page.click("a.next")
        } else return allProducts
      }
    },
  },
  {
    name: "Cyberpuerta",
    url: [
      "https://www.cyberpuerta.mx/Computo-Hardware/Componentes/Procesadores/Procesadores-para-PC/",
      "https://www.cyberpuerta.mx/Computo-Hardware/Componentes/Tarjetas-Madre/",
      "https://www.cyberpuerta.mx/Computo-Hardware/Componentes/Tarjetas-de-Video/",
      "https://www.cyberpuerta.mx/Computo-Hardware/Componentes/Fuentes-de-Poder-para-PC-s/",
      "https://www.cyberpuerta.mx/Computo-Hardware/Componentes/Gabinetes/",
    ],
    logo: "https://www.cyberpuerta.mx/out/cyberpuertaV5/img/logo2.png",
    products: async ({ page, url }) => {
      const allProducts = []
      let continuar = true
      for (const link of url) {
        try {
          await page.goto(link)

          while (continuar) {
            await new Promise(resolve => {
              setTimeout(() => {
                resolve("resolved")
              }, 3000)
            })

            const products = await page.evaluate(() => {
              const products = []
              document.querySelectorAll(".emproduct").forEach(product => {
                const name = product.querySelector(
                  ".emproduct_right_title"
                ).innerText
                const price = product.querySelector(".price").innerText
                const stock = product.querySelector(".emstock_nostock")
                  ? false
                  : true
                const image = product
                  .querySelector(".cs-image")
                  .style.backgroundImage.slice(5, -2)
                products.push({ name, price, stock, image })
              })
              return products
            })
            allProducts.push(...products)
            continuar = await page.evaluate(() => {
              if (!document.querySelector("a.next")) return false
              return true
            })
            if (continuar) {
              await page.click("a.next")
            } else break
          }
        } catch (error) {
          console.log(error)
        }
        continuar = true
      }
      return allProducts
    },
  },
]
