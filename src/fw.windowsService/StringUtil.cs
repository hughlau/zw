using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Diagnostics;

namespace fw.windowsService
{
    public class StringUtil
    {
        private static String hexString = "0123456789ABCDEF";
        public static String DecodeUnicode(String dataStr)
        {
            Regex reg = new Regex(@"(?i)\\[uU]([0-9a-f]{4})");
            return reg.Replace(dataStr, delegate(Match m) { return ((char)Convert.ToInt32(m.Groups[1].Value, 16)).ToString(); });
        }

        public static String string2unicode(String str)
        {
            str = (str == null ? "" : str);
            String tmp;
            StringBuilder sb = new StringBuilder(1000);
            char c;
            int i, j;
            for (i = 0; i < str.Length; i++)
            {
                c = str.CharAt(i).ToCharArray()[0];
                Debug.WriteLine(c);
                sb.Append("\\u");
                j = (c >> 8);
                tmp = Convert.ToString(j, 16);
                if (tmp.Length == 1)
                    sb.Append("0");
                sb.Append(tmp);
                j = (c & 0xFF);
                tmp = Convert.ToString(j, 16);
                if (tmp.Length == 1)
                    sb.Append("0");
                sb.Append(tmp);

            }
            return sb.ToString();
        }

        public static String unicode2string(String str)
        {
            str = (str == null ? "" : str);
            if (str.IndexOf("\\u") == -1)
                return str;

            StringBuilder sb = new StringBuilder();
            try
            {
                for (int i = 0; i <= str.Length - 6; )
                {
                    String strTemp = str.Substring(i, i + 6);
                    String value = strTemp.Substring(2);
                    int c = 0;
                    for (int j = 0; j < value.Length; j++)
                    {
                        char tempChar = value.CharAt(j).ToCharArray()[0];

                        int t = 0;
                        switch (tempChar)
                        {
                            case 'a':
                                t = 10;
                                break;
                            case 'b':
                                t = 11;
                                break;
                            case 'c':
                                t = 12;
                                break;
                            case 'd':
                                t = 13;
                                break;
                            case 'e':
                                t = 14;
                                break;
                            case 'f':
                                t = 15;
                                break;
                            default:
                                t = tempChar - 48;
                                break;
                        }

                        c += t * ((int)Math.Pow(16, (value.Length - j - 1)));
                    }
                    sb.Append((char)c);

                    i = i + 6;
                }
            }
            catch (Exception ex)
            {

            }
            return sb.ToString();
        }
    }
    public static class CharAtExtention
    {
        public static string CharAt(this string s, int index)
        {
            if ((index >= s.Length) || (index < 0))
                return "";
            return s.Substring(index, 1);
        }
    }
}
