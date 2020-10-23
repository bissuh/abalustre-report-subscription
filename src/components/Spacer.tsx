import { h } from 'preact';

interface Style {
  [key: string]: string | undefined;
  marginRight: string;
  marginTop: string;
  width: string;
}

function Spacer({
  children = [<div></div>],
  contentAlign = 'left',
  direction = 'row',
  horizontal = 'center',
  padding = '10px 0',
  space = '10',
  vertical = 'center',
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        justifyContent: contentAlign,
        padding,
        alignContent: horizontal,
        alignItems: vertical,
      }}
    >
      {Array.isArray(children)
        ? children.map((elem, idx) => {
            const lastItem = idx === children.length - 1;
            const marginH =
              lastItem && direction === 'row' ? '0' : space || '10';

            const style: Style = {
              marginRight: `${marginH}px`,
              marginTop: '',
              width: horizontal === 'stretch' ? '100%' : 'auto',
            };

            if (direction === 'column') {
              style.marginRight = '';
              style.marginTop = `${marginH}px`;
            }

            return elem ? (
              <div
                key={idx}
                style={{
                  marginRight: style.marginRight,
                  width: style.width,
                  marginTop: style.marginTop,
                }}
              >
                {elem}
              </div>
            ) : null;
          })
        : children}
    </div>
  );
}

export default Spacer;
