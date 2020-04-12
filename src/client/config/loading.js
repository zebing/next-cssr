import React from 'react';
// import { CONFIG_FILE } from '../../lib/constants';

const defaultLoading = `
    <style>
    body {
      padding: 0;
      margin: 0;
    }
    .pre-loading-hkdndhj{
      background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFbUlEQVR4Xu2bTWwbRRTH/29ir1PlxqUIxZsEktROq3CpQOopPdRwKJVweoiDOCEVcYNWwJFyLULlhkDihqiEmiIVDhAO7QUEiAsBaucD6o8IpZfcosZrex4a1w7GsndmP2yH4D16Z+a9+c2b55md/xAG9KzbsY8YnFLmCbR6olh+dRCu0CCMZm3rKgHvtNpm4N1k0bnab3/6DiA7OTpJUt7v1FEWYiqZ38/3E0L/AYxHFkiIOx0BSHk2uV29OwTQRwLDCOgj7Lqp7HAK/EdzwD07dg7AyRHiwv6+s/r0A+z5iZ5eRcAvxzE2OmqlakwTAH6fK5a/NfHPKAfk4tE7IFpoaTAvCFdmC84tEyOtZXoBYGPCSkvG+wAmD2wx302UKmd1/mkBZOOx54j46w4NVRiUThbLX+mM9BJA1o6dJ7AaiGi7H8z0fLJU/sbNPy2A3ETsTTBf6/i/DeyBKZ0slVdNIYQZAdl4LAXiWwSMdbRP9FaiUH4vEID1CetFZriF+i5LuWi6gAkLQKOdFQCPdesgEdInCs4XgQCoyut2dJVBKgl2fBjYAcnFZKH6vS4Stp44Fq9GasVO5SLVEXv6r4clXRvZicgZsFgh4HGXsvly2TmlS9baKaAMbNrWnAQ+Z+Cki8ECmC8mSpWfdR3I2dZtAC+0lfsyUXQuaOvGo6dBdBOAyvbdnoogLJkkaSMAHiBsQuJiYttZ03WksSN8RZVj4BOTnWBu3JqHgOr8jEs07gG0ZJqcjQEYQyCsWSKaevL+3gMdBC/v/5waO+7IyioY8y71dpkp4yUpewJgCqEXe/tO3xBaQdTzkJQZ02TcrOsZgAmEAQAoMMllkyTcHj2+AOgg9BnAJpiXTZJvp6njG0ATQo1wo31eJopOoHa7zfGcbfG/3hHWUMPLJkm3W5uBHVXJqVyrvNY0YJLNvSS/9rIqFzR/i41EPwyabAMDCNKZw1B3COAwjMIgfRhGwCDpHwbbwwhojoLaplZE5SmTUYnK6B8m21aTtsIq49f/egR02Z7qfDPavuoaCeN9EP9Jt8lwc7AXS16vQIL6TznbUl9gxr0abpTfThSduM+6oVQL6r8CoE5q//mc7M2tfKLoTHmrEm7poP5TQ6hwyY9bBPp4UMKGpr9B/a8nQT/z6DDM/yaEIP4frAOUcAHVqtlUiETy/RYy6CLUr//DhZCO7FF/P4yAoz7Cuv4NI0BH6Ki/DxwB9RObWuUymJ8B0U+JovN2L6Gp4zEWSEcZN6dLzm9BbQUCoA5N+/pZvE2pwowfiXFpIJ/F3U6Mmfh6slC5HHR0WuurI3Fi8V2HNvt/MKI9LjfU53gB5LbcZUYxKmRm2kCf0G7T8xTQdv6RhWth54KtuHWqSvjVBdrOiBCZmfy+J6mtJwBGne/R8Xh90xa3fiDCsy4QdkeYMjMeNEvGAIw6DxgLJPzcFzARSADYE6ClWUP1mhEAk86reUjgRZNT2iD3BXLx6GkGrRDBdomEcCUyOpEUgJ0IyUWTJBTGfYGticiZKgulEOu9SGojbmUk4TPXeSfEomnyCUsmtzk5ulCT0lUmJxjLsyXnhtu/jXYK3LNjrwvw9S6N7I0wpb0knbAAKH8247FUjeoq0Y5CSQl6Y65Y/iAogHMC3EkJWhGgtGmyOfh8FbJcfsOOnZddpLISlNKJprURoBzP2danAF5qIfn/EUsfjJwSTQvMC8nbDx3ntk6B2S3swpwCrTaUXP6YZV2QgsZZYk0nkm7WNYoAL0tWXdleAdDZ7fZ+CMAvOb/1hhEQ8r+A34EY5oAGgb7ngDDuCwQd9db6fQfQWFf4vi8QZudVWwMBUN/bP7pB7um+QNidV+39DUkgDDp4A1jwAAAAAElFTkSuQmCC);
      background-repeat: no-repeat;
      background-size: cover;
      width: 32px;
      height: 32px;
      -webkit-animation:loading 2s linear infinite;
      animation:loading 2s linear infinite}
      @-webkit-keyframes loading{
        0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}
        to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}
      }
      @keyframes loading{
        0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}
        to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}
      }
    }
    </style>
    <div class="pre-loading-hkdndhj"></div>
`;

export function getLoading(pageConfig) {
  const Loading = pageConfig.loading;
  const LoadingDom = Loading
    ? <Loading />
    : (<div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center',
        height: '100vh',
        minHeight: '300px',
      }}
      dangerouslySetInnerHTML={{ __html: defaultLoading }}
    ></div>);

  return LoadingDom;
}
