/*
تم تطوير هذا المشروع من عمر المويهي والمشروع مفتوح المصدر 
وهو لجلب حالة الدفع للحاج عبر منصة حلول الاعمال لحجاج الداخل
ادخل بيانات حسابك في الاسفل وراح يسجل تلقائي بعدها يوصلك كود دخله خلال 20 ثانيه
بعدها راح ينقل للصفحة ويشتغل النظام
وتنزل معك النتائج في ملف الاكسل الي اسمه result

ملاحضات:
اذا توقف المشروع عادي شغله مره ثانيه وراح يكمل من حيث وقف ومايصير تكرار
دخل الكود بسرعه + لاتلمس الماوس اذا بدء المشروع يشتغل
+ انتبه لعدد الحجاج كم واذا شفته للعدد وقفه الى الان مافيه ايقاف تلقائي
بياناتك بامان والمشروع يصل للمنصة مثله مثل اي مستخدم عادي بشكل قانوني ولكن يسهل عملك فقط
تويتر :
https://twitter.com/xomar933
لاتنسونا من دعائكم
*/

require('dotenv').config()

// حط معلوماتك هنا
var username = process.env.User // اسم مستخدم المنصة
var password = process.env.Pass // الباسورد
const puppeteer = require('puppeteer-core')


//  ------------- ملاحظات اسماء  الازرار مالها فايده اذا تبي تحذفها ---------------------------
// const puppeteer = require('puppeteer')
// book id
//*[@id="j_idt181:j_idt182"]/div[1]/div[1]/div/div[2]/span[2]
//  stats
//*[@id="kt_content"]/div[2]/div/div/div/div[1]/div[1]/div/div[1]/span[2]
// Lmit butt
//*[@id="j_idt152:primetable:j_id2"]
//  limt 100
//*[@id="j_idt152:primetable:j_id2"]/option[4]
// pages text
//*[@id="j_idt152:primetable_paginator_bottom"]/span[1]
// *[@id="j_idt152:primetable_paginator_bottom"]/span[2]/a[1]
//*[@id="j_idt152:primetable_paginator_bottom"]/span[2]/a[2]

//*[@id="j_idt181:j_idt182"]/div[2]/div[1]/div/div[1]/span[2]
// main div
//*[@id="j_idt181:j_idt182"]
// otp input
//*[@id="j_verifyCode"]
//  pages
//*[@id="j_idt152:primetable_paginator_bottom"]/span[2]/a[2]

// *[@id="j_idt152:primetable_data"]/tr[3]/td[14]/button/i`
// عدد الحجاج
//*[@id="j_idt152:primetable_data"]/tr[1]/td[14]/button/i
//  ------------- ملاحظات اسماء  الازرار مالها فايده اذا تبي تحذفها ---------------------------

const reader = require('xlsx')

// Reading our test file
const file = reader.readFile('./result.xlsx')

// Convert the XLSX to JSON
let worksheets = {};
for (const sheetName of file.SheetNames) {
  worksheets[sheetName] = reader.utils.sheet_to_json(file.Sheets[sheetName]);
}

let HajjsNumber
var rows;
(async () => {
  let launchOptions = {
    // executablePath: revisionInfo.executablePath,
    // args: ['--no-sandbox', "--disabled-setupid-sandbox"],
    headless: false,
    // executablePath: "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
    executablePath: process.env.browserUrl,
    args: ['--start-maximized']
  };
  console.log("1")
  const browser = await puppeteer.launch(launchOptions);
  console.log("1.5")
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(90000);
  console.log("2")
  await page.goto('https://bsp.haj.gov.sa/')

  var userInput = await page.waitForXPath(`//*[@id="j_username"]`)
  await page.type(`input[id="j_username"]`, username, { delay: 20 })
  var passInput = await page.waitForXPath(`//*[@id="j_password"]`)
  await page.type(`input[id="j_password"]`, password, { delay: 20 })
  await page.click('xpath///*[@id="j_idt30"]')
  setTimeout(async function () {
    url = 'https://bsp.haj.gov.sa/lhop/pages/HO/reservation/List.xhtml';
    console.log(url)
    await page.goto(url)
    // await page.reload();
    await page.waitForXPath(`//*[@id="j_idt152:primetable:j_id2"]`)
    console.log("4")
    //*[@id="j_idt152:primetable:j_id2"]
    //*[@id="j_idt152:primetable:j_id2"]/option[4]
    //*[@id="j_idt156"]/div/div/div/div/div/a[1]
    await page.select('xpath///*[@id="j_idt152:primetable:j_id2"]', '100').catch(exception => {
      dddd(page, 1, true);
      console.log(`element not shown: ${exception}`)
      return
    }
    );
    console.log("limit done")
    //*[@id="j_idt152:primetable_paginator_bottom"]/span[1]
    var BookId_selector = await page.waitForXPath(`//*[@id="j_idt152:primetable_paginator_bottom"]/span[1]`).catch(exception => {
      dddd(page, row, true);
      console.log(`element not shown: ${exception}`)
      return
    }
    );
    var OrdersLengthString = await page.evaluate(element => element.textContent, BookId_selector).catch(exception => {
      dddd(page, row, true);
      console.log(`element not shown: ${exception}`)
      return
    }
    );
    HajjsNumber = OrdersLengthString.split(" ")[3] || null
    dddd(page, 1, false)
  }
    , 25 * 1000)
  console.log("3")
})();
var url
var pageIndex = 1
var wait = false
let rows_total = 0;
let repeated_total = 0;
async function dddd(page, _row, timer) {
  var row = _row
  if (row >= HajjsNumber && HajjsNumber != null) {
    console.log("تم الانتهاء من العملية افحص ملف الاكسل")
    return
  }
  if (wait == true) {
    console.log("````````````````````````` الرجاء الانتضار او اعادة فتح البرنامج `````````")
    // setTimeout(() => {
    //   dddd(page, _row, true)لا  
    // }, 1000);
    return
  }
  if (timer == true) {
    wait = true
    setTimeout(() => {
      wait = false
    }, 1000);
  }
  if (row >= 100) {
    pageIndex = pageIndex + 1
    row = 1
    console.log(`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);
    console.log(`تم قلب الى الصفحه ${pageindex}`);
    console.log(`^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^`);
  }
  if (pageIndex != 1) {
    await page.waitForXPath(`//*[@id="j_idt152:primetable_paginator_bottom"]/span[2]/a[${pageIndex}]`);
    await page.click(`xpath///*[@id="j_idt152:primetable_paginator_bottom"]/span[2]/a[${pageIndex}]`).catch(exception => {
      dddd(page, row, true);
      console.log(`element not shown: ${exception}`)
      return
    }
    );
  }
  var statusSelcetor = await page.waitForXPath(`//*[@id="j_idt152:primetable_data"]/tr[${row}]/td[13]`);
  var statusText = await page.evaluate(element => element.textContent, statusSelcetor)
  if (statusText != "غير مؤكد") {
    dddd(page, row + 1)
    console.log("تخطي مكرر" + row)
    return
  }

  console.log("5")
  var BookId_selector = await page.waitForXPath(`//*[@id="j_idt152:primetable_data"]/tr[${row}]/td[1]`).catch(exception => {
    dddd(page, row, true);
    console.log(`element not shown: ${exception}`)
    return
  }
  );
  var BookId_Text = await page.evaluate(element => element.textContent, BookId_selector).catch(exception => {
    dddd(page, row, true);
    console.log(`element not shown: ${exception}`)
    return
  }
  );

  var id_selector = await page.waitForXPath(`//*[@id="j_idt152:primetable_data"]/tr[${row}]/td[2]`).catch(exception => {
    dddd(page, row, true);
    console.log(`element not shown: ${exception}`)
    return
  }
  );

  var id_Text = await page.evaluate(element => element.textContent, id_selector).catch(exception => {
    dddd(page, row, true);
    console.log(`element not shown: ${exception}`)
    return
  }
  );
  if ((worksheets.Sheet1.filter(x => x.id === id_Text && x["Book_id"] == BookId_Text).length >= 1)) {
    console.log("تم التخطي اجمالي التخطي هو : " + repeated_total)
    dddd(page, row + 1)
    return
  } {



    await page.waitForXPath(`//*[@id="j_idt152:primetable_data"]/tr[${row}]/td[14]/button/i`).catch(exception => {
      // dddd(page, row, true);
      console.log(`element not shown: ${exception}`)
      // return
    }
    );
    await page.click(`xpath///*[@id="j_idt152:primetable_data"]/tr[${row}]/td[14]/button/i`).catch(exception => {
      // dddd(page, row, true);
      console.log(`element not shown: ${exception}`)
      // return
    }
    );
    console.log("5.1")
    await page.waitForXPath(`//*[@id="j_idt152:primetable_data"]/tr[${row}]/td[14]/ul/li/a`).catch(exception => {
      // dddd(page, row, true);
      console.log(`element not shown: ${exception}`)
      // return
    }
    );
    console.log("5.2")
    handles = await page.$(`xpath///*[@id="j_idt152:primetable_data"]/tr[${row}]/td[14]/ul/li/a`);
    await page.evaluate(b => b.click(), handles)
      // await page.click(`xpath///*[@id="j_idt152:primetable_data"]/tr[${row}]/td[14]/ul/li/a`)
      .catch(exception => {
        // dddd(page, row, true);
        console.log(`element not shown: ${exception}`)
        // return
      }
      );
    console.log("5.3")
    var BookId_selector = await page.waitForXPath(`//*[@id="kt_content"]/div[2]/div/div/div/div[1]/div[1]/div/div[1]/span[2]`).catch(exception => {
      dddd(page, row, true);
      console.log(`element not shown: ${exception}`)
      return
    }
    );
    var BookId_Text = await page.evaluate(element => element.textContent, BookId_selector).catch(exception => {
      dddd(page, row, true);
      console.log(`element not shown: ${exception}`)
      return
    }
    );
    console.log(BookId_Text)
    await page.waitForXPath(`//*[@id="j_idt181:j_idt182"]`)

    let len = await page.$$('#j_idt181\\:j_idt182 > *');
    console.log(`------------------`)
    console.log(` عدد الاشخاص في الحجز :  ` + len)
    console.log(`------------------`)

    for (let i = 1; i <= len.length; i++) {
      console.log(`i : ` + i)
      // console.log("8")
      //*[@id="j_idt181:j_idt182"]/div[1]/div[1]/div/div[2]/span[2]
      //*[@id="j_idt181:j_idt182"]/div[1]/div[1]/div/div[1]/span[2]
      var Status_selector = await page.waitForXPath(`//*[@id="j_idt181:j_idt182"]/div[${i}]/div[1]/div/div[2]/span[2]`).catch(exception => {
        dddd(page, row, true);
        console.log(`element not shown: ${exception}`)
        return
      }
      );
      var status_text = await page.evaluate(element => element.textContent, Status_selector).catch(exception => {
        dddd(page, row, true);
        console.log(`element not shown: ${exception}`)
        return
      }
      );
      console.log("8.1")
      var id_selector = await page.waitForXPath(`//*[@id="j_idt181:j_idt182"]/div[${i}]/div[1]/div/div[1]/span[2]`).catch(exception => {
        dddd(page, row, true);
        console.log(`element not shown: ${exception}`)
        return
      }
      );

      var id_Text = await page.evaluate(element => element.textContent, id_selector).catch(exception => {
        dddd(page, row, true);
        console.log(`element not shown: ${exception}`)
        return
      }
      );
      console.log("8.2")
      // console.log(id_Text)

      console.log(worksheets.Sheet1.filter(x => x.id === id_Text && x["Book_id"] == BookId_Text).length)
      if ((worksheets.Sheet1.filter(x => x.id === id_Text && x["Book_id"] == BookId_Text).length >= 1))
      // if (!worksheets.Sheet1.includes({
      // "id": id_Text,
      //   "Book_id": BookId_Text,
      //   "status": status_text,
      // }))
      {
        repeated_total = repeated_total + 1
        console.log("رقم مكرر : " + repeated_total)
      } else {
        rows_total = rows_total + 1;
        worksheets.Sheet1.push({
          "id": id_Text,
          "Book_id": BookId_Text,
          "status": status_text,
        });

        console.log(`*********************`)
        console.log(`اجمالي الحجوزات التي اضافتها للكشف هو : ${rows_total}`)
        console.log(`رقم الصف هو : ` + row)
        console.log(`الصفحه : ${pageIndex}`)
        console.log(`البيانات المسجله هي :`)
        console.log({
          "id": id_Text,
          "Book_id": BookId_Text,
          "status": status_text,
        });
        console.log(`*********************`)

      }
    }

    reader.utils.sheet_add_json(file.Sheets["Sheet1"], worksheets.Sheet1)
    reader.writeFile(file, './result.xlsx');
    console.log("تم الحفظ")
    // back home
    //*[@id="j_idt156"]/div/div/div/div/div/a[1]
    await page.click(`xpath///*[@id="j_idt156"]/div/div/div/div/div/a[1]`).catch(exception => {
      dddd(page, row, true);
      console.log(`element not shown: ${exception}`)
      return
    }

    );
    dddd(page, row + 1)
  }
}
