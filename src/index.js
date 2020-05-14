/**
 * @file    颜色转换
 * @author  ReAlign<realign@yeah.net>
 * @date    2019-04-06
 */
const Color = {
    HEX: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
    // hsb 转 rgb对象
    hsb2RgbObj(hsb = {}) {
        const {
            h,
            s,
            b
        } = hsb;
        const rgb = {};
        let hh = Math.round(h);
        let ss = Math.round(s * 255 / 100);
        let bb = Math.round(b * 255 / 100);

        if (ss === 0) {
            rgb.r = rgb.g = rgb.b = bb;
        } else {
            let t1 = bb;
            let t2 = (255 - ss) * bb / 255;
            let t3 = (t1 - t2) * (hh % 60) / 60;

            if (hh === 360) {
                hh = 0;
            }

            if (hh < 60) {
                rgb.r = t1;
                rgb.b = t2;
                rgb.g = t2 + t3
            } else if (hh < 120) {
                rgb.g = t1;
                rgb.b = t2;
                rgb.r = t1 - t3
            } else if (hh < 180) {
                rgb.g = t1;
                rgb.r = t2;
                rgb.b = t2 + t3
            } else if (hh < 240) {
                rgb.b = t1;
                rgb.r = t2;
                rgb.g = t1 - t3
            } else if (hh < 300) {
                rgb.b = t1;
                rgb.g = t2;
                rgb.r = t2 + t3
            } else if (hh < 360) {
                rgb.r = t1;
                rgb.g = t2;
                rgb.b = t1 - t3
            } else {
                rgb.r = 0;
                rgb.g = 0;
                rgb.b = 0
            }
        }

        return {
            r: Math.round(rgb.r),
            g: Math.round(rgb.g),
            b: Math.round(rgb.b)
        };
    },
/****** 支持 rgb/rgba 系列 *****************************************************/
    // hex 转 rgba字符串
    hex2Rgba(str = '') {
        let strLower = str.toLowerCase();
        const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/;

        if (strLower && reg.test(strLower)) {
            let str8 = '#'; // 六位色值
            let alpha = 'ff'; // 透明度
            const len = strLower.length;
            // 处理三位的颜色值
            if (len === 4) {
                for (let i = 1; i < 4; i++) {
                    str8 += strLower.slice(i, i + 1).concat(strLower.slice(i, i + 1));
                }
            }
            if (len === 7) {
                str8 = strLower;
            }
            if (len === 9) {
                str8 = strLower.substr(0, 7);
                alpha = strLower.substr(7, 2);
            }
            //处理统一的六位的颜色值
            const str8Arr = [];
            for (let i = 1; i < 7; i += 2) {
                str8Arr.push(parseInt(`0x${str8.slice(i, i + 2)}`));
            }

            // 处理透明度
            // Number(n.toFixed(2)) => 保证有效数，但是当整数时，没有.00 这样的后缀
            alpha = Number((parseInt(`0x${alpha}`) / 255).toFixed(2));
            str8Arr.push(alpha);

            strLower = `rgba(${str8Arr.join(',')})`;
        }
        return strLower;
    },
    // rgba 转 hex
    rgba2Hex(rgb = '') {
        const re = Color.getRGBA(rgb);
        let hexColor = '#';
        for (let i = 0; i < re.length; i++) {
            let r = null;
            let c = re[i];
            if (i < 3) {
                const l = c;
                var hexAr = [];
                while (c > 16) {
                    r = c % 16;
                    c = (c / 16) >> 0;
                    hexAr.push(Color.HEX[r]);
                }
                hexAr.push(Color.HEX[c]);
                if (l < 16 && l !== '') {
                    hexAr.push(0)
                }
                hexColor += hexAr.reverse().join('');
            } else {
                /**
                 * 例 : 透明度为30%的黑色
                    算法：
                    十六进制的 ff ，转换成十进制    255
                    255*0.3  约等于 76,
                    76转换成十六进制  ===> 4C
                    so :   #4C000000
                */
               const _base = (255 * c).toString(16).substr(0, 2);
               const _pref = _base.length === 1 ? '0' : '';
                hexColor += `${_pref}${_base}`;
            }
        }

        return hexColor;
    },
    // rgba 转 hsb
    rgba2Hsb(arr = []) {
        const arr3 = arr.filter((c, i) => i < 3);
        let h = 0;
        let s = 0;
        let v = 0;
        let r = arr3[0];
        let g = arr3[1];
        let b = arr3[2];
        arr3.sort((a, b) => a - b);
        let max = arr3[2]
        let min = arr3[0];
        v = max / 255;
        s = max === 0 ? 0 : (1 - (min / max));
        if (max === min) {
            h = 0;//事实上，max === min 的时候，h无论为多少都无所谓
        } else if (max === r && g >= b) {
            h = 60 * ((g - b) / (max - min)) + 0;
        } else if (max === r && g < b) {
            h = 60 * ((g - b) / (max - min)) + 360
        } else if (max === g) {
            h = 60 * ((b - r) / (max - min)) + 120
        } else if (max === b) {
            h = 60 * ((r - g) / (max - min)) + 240
        }
        h = parseInt(h);
        s = parseInt(s * 100);
        v = parseInt(v * 100);
        return {
            h,
            s,
            b: v
        };
    }
};

// rgba对象 生成 rgba字符串
Color.makeRgbaStr = (rgb, a) => {
    a = a === undefined ? 1 : a;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
};
Color.hex2Hsb = (hex) => Color.rgb2Hsb(Color.hex2RgbObj(hex));
Color.typeOf = (o) => o === null ? String(o) : ({}).toString.call(o).slice(8, -1).toLowerCase();
Color.getMinStr = (str = '') => Color.typeOf(str) === 'string' ? (str || '').replace(/\s*/g, '') : str;
// 获取
Color.getRGBA = (str = '', mode = 'arr') => {
    // 匹配小括号中间
    const getInner = /\((.+?)\)/g;
    // 获得小括号中间内容
    const innerRes = (getInner.exec(Color.getMinStr(str)) || [])[1];
    // 按逗号分割，map 出数组数组
    const numArr = innerRes.split(',').map(n => Number(n));

    if(numArr[3] === undefined) {
        numArr[3] = 1;
    }

    if(mode === 'obj') {
        const _obj = {};
        const _keys = ['r','g','b','a'];
        _keys.forEach((k, i) => { _obj[k] = numArr[i]; });

        return _obj;
    }

    return numArr;
};

export default Color;