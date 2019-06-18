// Packages
const cheerio = require('cheerio')

module.exports = function shakingEffect(data) {

  const processStyle = (data) => {
    const endOfStyleBlock = data.indexOf('</style>')
    const styleToInsert = `
/* Module: Shaking effect height on: ${new Date()} */
.shake {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
}

/* Keyframes shake moz */
@-moz-keyframes shake {
    10%, 90% {
        -moz-transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
        -moz-transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
        -moz-transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
        -moz-transform: translate3d(4px, 0, 0);
    }
}

/* Keyframes shake webkit */
@-webkit-keyframes shake {
    10%, 90% {
        -webkit-transform: translate3d(-1px, 0, 0);
    }

    20%, 80% {
        -webkit-transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
        -webkit-transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
        -webkit-transform: translate3d(4px, 0, 0);
    }
}

/* Keyframes shake moz */
@keyframes shake {
    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }
    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }
    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }
    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}

/* Module: Shaking effect */
    `;

    return data.substring(0, endOfStyleBlock) + '\n' + styleToInsert + '\n\n' + data.substring(endOfStyleBlock)

  };

  const processJs = (data) => {

    const $ = cheerio.load(data, {
      decodeEntities: false
    })

    const frbSubmit = $('#frb-form .frb-submit').first().attr('id');
    const regExpFunction = RegExp(/(\$\(function\(\)*?\s?{)/g)

    const scriptToInsert = `
    // DOM event of shaking effect: Handle .frb-submit of first step
    $('#${frbSubmit}').on('click', function() {
      // Amounts validation
      if (!frb.validateAmount() ) {
        $('.frb-amounts').addClass('shake');
        setTimeout(function() {
            $('.frb-amounts').removeClass('shake');
        }, 1000);
      }

      // Optin validation
      if($('.frb-error-optin').is(':visible')) {
        $('.frb-optin').addClass('shake');
        setTimeout(function() {
            $('.frb-optin').removeClass('shake');
        }, 1000);
      }

      // Methods validation
      if ($('input[name="frb-methods"]:checked').length !== 1) {
        $('.frb-methods').addClass('shake');
        setTimeout(function() {
            $('.frb-methods').removeClass('shake');
        }, 1000);
      }
    })
    `

    data = data.replace(regExpFunction, `$1\n\t${scriptToInsert}`)
    return data
  }


  data = processStyle(data)
  data = processJs(data)

  return data
}
