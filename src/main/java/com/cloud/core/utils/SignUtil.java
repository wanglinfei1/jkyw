package com.cloud.core.utils;

import net.sf.json.JSONArray;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

/**
*
* 项目名称：wechatlib
* 类名称：SignUtil
* 类描述：url配置请求校验工具类
* 创建人：WQ
* 创建时间：2013-10-3 下午4:09:14
* @version
*/
public class SignUtil {

    private static Log log = LogFactory.getLog(SignUtil.class);

   /**
    * 验证签名
    *
    * @param signature  微信加密签名
    * @param timestamp  时间戳
    * @param nonce      随机数
    * @return
    */
   public static boolean checkSignature(String signature, String timestamp, String nonce, String token) {
       String[] arr = new String[] { token, timestamp, nonce };
       // 将token、timestamp、nonce三个参数进行字典序排序
       Arrays.sort(arr);
//       log.info(JSONArray.fromObject(arr).toString());
       StringBuilder content = new StringBuilder();
       for (int i = 0; i < arr.length; i++) {
           content.append(arr[i]);
       }
       MessageDigest md = null;
       String tmpStr = null;

       try {
           md = MessageDigest.getInstance("SHA-1");
           // 将三个参数字符串拼接成一个字符串进行sha1加密
           byte[] digest = md.digest(content.toString().getBytes());
           tmpStr = byteToStr(digest);
       } catch (NoSuchAlgorithmException e) {
           e.printStackTrace();
       }
       
       System.out.println("SignUtil:46 - " + tmpStr);
       content = null;
       // 将sha1加密后的字符串可与signature对比，标识该请求来源于微信
       return tmpStr != null ? tmpStr.equals(signature.toUpperCase()) : false;
   }

   /**
    * 将字节数组转换为十六进制字符串
    *
    * @param byteArray
    * @return
    */
   private static String byteToStr(byte[] byteArray) {
       String strDigest = "";
       for (int i = 0; i < byteArray.length; i++) {
           strDigest += byteToHexStr(byteArray[i]);
       }
       return strDigest;
   }

   /**
    * 将字节转换为十六进制字符串
    *
    * @param mByte
    * @return
    */
   private static String byteToHexStr(byte mByte) {
       char[] Digit = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
       char[] tempArr = new char[2];
       tempArr[0] = Digit[(mByte >>> 4) & 0X0F];
       tempArr[1] = Digit[mByte & 0X0F];
       String s = new String(tempArr);
       return s;
   }
}
