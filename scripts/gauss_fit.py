import numpy as np
from scipy.optimize import curve_fit
import sys

x = eval('[' + sys.argv[1] + ']')
y = eval('[' + sys.argv[2] + ']')

def provider(x, a, b, c):
  return a * np.exp(-(x - b)*(x - b) / (2 * c * c))

params, pcov = curve_fit(provider, x, y)

err = np.sqrt(np.diag(pcov))

print(params)
print(err)
