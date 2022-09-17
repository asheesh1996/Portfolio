namespace Portfolio.Services
{
    public class Test
    {
    }

    public enum LogType
    {
        LetterLog,
        DigitLog,
    }
    public class Log : IComparer<Log>
    {

        public Log(string log)
        {
            _log = log;
            tokensArray = log.Split(' ');
            if (int.TryParse(tokensArray[1], out int val))
            {
                logType = LogType.DigitLog;
            }
            else
            {
                logType = LogType.LetterLog;
            }

          
        }
        public LogType logType { get; }
        public string _log;
        public string[] tokensArray { get; }
        public int Compare(Log x, Log y)
        {
            int index = 1;
            int result = 0;
            
            while ((result = string.Compare(x.tokensArray[index], y.tokensArray[index])) == 0)
            {
                index++;
            }
            return result;
        }
    }

}
