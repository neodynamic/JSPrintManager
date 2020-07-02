<%@ WebHandler Language="C#" Class="GetEncryptPassword" %>

using System.Text;
using System.Web;
using System.Security.Cryptography.Pkcs;
using System.Security.Cryptography.X509Certificates;
using System.Collections.Generic;
using System.IO;
using System.Web.Script.Serialization;

public class GetEncryptPassword : IHttpHandler {

    public void ProcessRequest (HttpContext context) {
        const string PASSWORD = "ABC123";
        context.Response.ContentType = "text/plain";
        var jss = new JavaScriptSerializer();
        string json = new StreamReader(context.Request.InputStream).ReadToEnd();
        Dictionary<string, string> sData = jss.Deserialize<Dictionary<string, string>>(json);
        byte[] cert_bytes = Encoding.ASCII.GetBytes(sData["Certificate"]);
        X509Certificate2 ad = new X509Certificate2(cert_bytes);

        ContentInfo ci = new ContentInfo(Encoding.UTF8.GetBytes(PASSWORD));
        EnvelopedCms cms = new EnvelopedCms(ci);
        cms.Encrypt(new CmsRecipient(ad));
        byte[] encoded_cms = cms.Encode();
        context.Response.ContentType = "text/plain";
        context.Response.Write(System.Convert.ToBase64String(encoded_cms));
    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}