/**
 * @param {string} fullName
 * @param {string} userId
 * @param {string} baseUrl
 * @param {string} email
 * @returns {string} Welcome and Verify HTML Template
 */
const welcomeAndVerify = ({fullName = "", userId = "", baseUrl = "", email = ""}) => {
    return `
    <!DOCTYPE html>

<html
  lang="en-GB"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:v="urn:schemas-microsoft-com:vml"
>
  <head>
    <title></title>
    <meta charset="utf-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <!--[if mso
      ]><xml
        ><o:OfficeDocumentSettings
          ><o:PixelsPerInch>96</o:PixelsPerInch
          ><o:AllowPNG /></o:OfficeDocumentSettings></xml
    ><![endif]-->
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat"
      rel="stylesheet"
      type="text/css"
    />
    <!--<![endif]-->
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }

      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }

      p {
        line-height: inherit;
      }

      @media (max-width: 520px) {
        .icons-inner {
          text-align: center;
        }

        .icons-inner td {
          margin: 0 auto;
        }

        .row-content {
          width: 100% !important;
        }

        .stack .column {
          width: 100%;
          display: block;
        }
      }
    </style>
  </head>
  <body
    style="
      background-color: #ffffff;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    "
  >
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="nl-container"
      role="presentation"
      style="
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        background-color: #ffffff;
      "
      width="100%"
    >
      <tbody>
        <tr>
          <td>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-1"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000000;
                        width: 500px;
                      "
                      width="500"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              padding-top: 5px;
                              padding-bottom: 5px;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="100%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td style="width: 100%; text-align: center">
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #555555;
                                      font-size: 23px;
                                      font-family: 'Montserrat', 'Trebuchet MS',
                                        'Lucida Grande', 'Lucida Sans Unicode',
                                        'Lucida Sans', Tahoma, sans-serif;
                                      line-height: 120%;
                                      text-align: center;
                                      direction: ltr;
                                      font-weight: normal;
                                      letter-spacing: normal;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <strong>Markdown Blog</strong>
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-2"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000000;
                        width: 500px;
                      "
                      width="500"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              padding-top: 5px;
                              padding-bottom: 5px;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="100%"
                          >
                            <table
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              class="divider_block"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td>
                                  <div align="center">
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                      "
                                      width="100%"
                                    >
                                      <tr>
                                        <td
                                          class="divider_inner"
                                          style="
                                            font-size: 1px;
                                            line-height: 1px;
                                            border-top: 1px solid #bbbbbb;
                                          "
                                        >
                                          <span> </span>
                                        </td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                  "
                                >
                                  <div align="center" style="line-height: 10px">
                                    <img
                                      src="https://raw.githubusercontent.com/kunalkeshan/mkd-blog/main/public/images/assets/mkd-blog-black.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 200px;
                                        max-width: 100%;
                                      "
                                      width="200"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              class="text_block"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                word-break: break-word;
                              "
                              width="100%"
                            >
                              <tr>
                                <td>
                                  <div style="font-family: sans-serif">
                                    <div
                                      style="
                                        font-size: 12px;
                                        mso-line-height-alt: 21.6px;
                                        color: #555555;
                                        line-height: 1.8;
                                        font-family: 'Montserrat',
                                          'Trebuchet MS', 'Lucida Grande',
                                          'Lucida Sans Unicode', 'Lucida Sans',
                                          Tahoma, sans-serif;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 12px;
                                          text-align: center;
                                        "
                                      >
                                        Hey there <strong>${fullName}</strong>,
                                        welcome to
                                        <strong>Markdown Blog! </strong>
                                      </p>
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 12px;
                                          text-align: center;
                                        "
                                      >
                                        You're in for a journey and we're glad
                                        to be a part of it. 
                                      </p>
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 12px;
                                          text-align: center;
                                        "
                                      >
                                        Before moving on, let's verify your
                                        account. You can do so by clicking the
                                        button below, or simply copy paste the
                                        link below to your browser. 
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              class="button_block"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td>
                                  <div align="center">
                                    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${baseUrl}/author/api/verify-${userId}" style="height:42px;width:84px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#3AAEE0"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:'Trebuchet MS', Tahoma, sans-serif; font-size:16px"><!
                                    [endif]--><a
                                      href="${baseUrl}/author/verify/${userId}"
                                      style="
                                        text-decoration: none;
                                        display: inline-block;
                                        color: #ffffff;
                                        background-color: #3aaee0;
                                        border-radius: 4px;
                                        width: auto;
                                        border-top: 1px solid #3aaee0;
                                        border-right: 1px solid #3aaee0;
                                        border-bottom: 1px solid #3aaee0;
                                        border-left: 1px solid #3aaee0;
                                        padding-top: 5px;
                                        padding-bottom: 5px;
                                        font-family: 'Montserrat',
                                          'Trebuchet MS', 'Lucida Grande',
                                          'Lucida Sans Unicode', 'Lucida Sans',
                                          Tahoma, sans-serif;
                                        text-align: center;
                                        mso-border-alt: none;
                                        word-break: keep-all;
                                      "
                                      target="_blank"
                                      ><span
                                        style="
                                          padding-left: 20px;
                                          padding-right: 20px;
                                          font-size: 16px;
                                          display: inline-block;
                                          letter-spacing: normal;
                                        "
                                        ><span
                                          style="
                                            font-size: 16px;
                                            line-height: 2;
                                            word-break: break-word;
                                            mso-line-height-alt: 32px;
                                          "
                                          >Verify</span
                                        ></span
                                      ></a
                                    >
                                    <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              class="text_block"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                word-break: break-word;
                              "
                              width="100%"
                            >
                              <tr>
                                <td>
                                  <div style="font-family: sans-serif">
                                    <div
                                      style="
                                        font-size: 12px;
                                        mso-line-height-alt: 14.399999999999999px;
                                        color: #555555;
                                        line-height: 1.2;
                                        font-family: 'Montserrat',
                                          'Trebuchet MS', 'Lucida Grande',
                                          'Lucida Sans Unicode', 'Lucida Sans',
                                          Tahoma, sans-serif;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 12px;
                                          text-align: center;
                                        "
                                      >
                                        <a
                                          href="${baseUrl}/author/verify/${userId}" 
                                          rel="noopener"
                                          style="
                                            text-decoration: underline;
                                            color: #0068a5;
                                          "
                                          target="_blank"
                                          title="Verify your account!"
                                          >${baseUrl}/author/verify/${userId}</a
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="text_block"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                word-break: break-word;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    padding-top: 70px;
                                    padding-right: 10px;
                                    padding-bottom: 10px;
                                    padding-left: 10px;
                                  "
                                >
                                  <div style="font-family: sans-serif">
                                    <div
                                      style="
                                        font-size: 14px;
                                        mso-line-height-alt: 16.8px;
                                        color: #555555;
                                        line-height: 1.2;
                                        font-family: 'Montserrat',
                                          'Trebuchet MS', 'Lucida Grande',
                                          'Lucida Sans Unicode', 'Lucida Sans',
                                          Tahoma, sans-serif;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                        "
                                      >
                                        <span style="font-size: 8px"
                                          >If there is any issue, email us at:
                                          <a rel="noopener noreferrer" target="_blank" href="mailto:${email}">${email}</a></span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-3"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000000;
                        width: 500px;
                      "
                      width="500"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              padding-top: 5px;
                              padding-bottom: 5px;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="100%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="icons_block"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  style="
                                    color: #9d9d9d;
                                    font-family: inherit;
                                    font-size: 15px;
                                    padding-bottom: 5px;
                                    padding-top: 5px;
                                    text-align: center;
                                  "
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                    "
                                    width="100%"
                                  >
                                    <tr>
                                      <td style="text-align: center">
                                        <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                        <!--[if !vml]><!-->
                                        <table
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="icons-inner"
                                          role="presentation"
                                          style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            display: inline-block;
                                            margin-right: -4px;
                                            padding-left: 0px;
                                            padding-right: 0px;
                                          "
                                        >
                                          <!--<![endif]-->
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- End -->
  </body>
</html>

        `
}

module.exports = welcomeAndVerify;